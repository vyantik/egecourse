import { Injectable, NotFoundException } from '@nestjs/common'
import { Review } from '@prisma/__generated__'
import { plainToInstance } from 'class-transformer'

import { Meta } from '@/libs/common/utils/meta'
import { PrismaService } from '@/prisma/prisma.service'
import { ReviewResponseEntity } from '@/review/entities/review-response.entity'

/**
 * Интерфейс для пагинированного списка отзывов
 */
export interface PaginatedReviews {
	/** Массив отзывов */
	data: Review[]
	/** Метаданные пагинации */
	meta: Meta
}

/**
 * Сервис для управления отзывами
 * Предоставляет методы для получения отзывов с возможностью пагинации
 */
@Injectable()
export class ReviewService {
	/**
	 * Конструктор сервиса отзывов
	 * @param prismaService - Сервис для работы с базой данных
	 */
	constructor(private readonly prismaService: PrismaService) {}

	/**
	 * Получает отзыв по его идентификатору
	 * @param reviewId - Уникальный идентификатор отзыва
	 * @returns Promise с найденным отзывом, преобразованным в ReviewResponseEntity
	 * @throws NotFoundException если отзыв не найден
	 */
	public async getReview(reviewId: string): Promise<ReviewResponseEntity> {
		const review = await this.prismaService.review.findUnique({
			where: {
				id: reviewId,
			},
			include: {
				user: true,
			},
		})

		if (!review) {
			throw new NotFoundException('Отзыв не найден')
		}

		return plainToInstance(ReviewResponseEntity, review, {
			excludeExtraneousValues: false,
		})
	}

	/**
	 * Получает список всех отзывов с опциональной пагинацией
	 * @param page - Номер страницы (опционально)
	 * @param limit - Количество элементов на странице (опционально)
	 * @returns Promise с массивом отзывов или объектом с данными и метаинформацией
	 *
	 * Если параметры пагинации не указаны, возвращает все отзывы.
	 * Если указаны page и limit, возвращает объект с отзывами и метаданными пагинации.
	 * В обоих случаях отзывы сортируются по дате создания (сначала новые).
	 */
	public async getReviews(
		page?: number,
		limit?: number,
	): Promise<ReviewResponseEntity[] | PaginatedReviews> {
		if (!page || !limit) {
			const reviews = await this.prismaService.review.findMany({
				orderBy: {
					createdAt: 'desc',
				},
				include: {
					user: true,
				},
			})

			return reviews.map(review =>
				plainToInstance(ReviewResponseEntity, review, {
					excludeExtraneousValues: false,
				}),
			)
		}

		const skip = (page - 1) * limit

		const [reviews, total] = await Promise.all([
			this.prismaService.review.findMany({
				skip,
				take: limit,
				orderBy: {
					createdAt: 'desc',
				},
				include: {
					user: true,
				},
			}),
			this.prismaService.review.count(),
		])

		return {
			data: reviews.map(review =>
				plainToInstance(ReviewResponseEntity, review, {
					excludeExtraneousValues: false,
				}),
			),
			meta: {
				total,
				page,
				limit,
				lastPage: Math.ceil(total / limit),
			},
		}
	}
}
