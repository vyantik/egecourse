import { Injectable, NotFoundException } from '@nestjs/common'
import { Review } from '@prisma/__generated__'
import { plainToInstance } from 'class-transformer'

import { Meta } from '@/libs/common/utils/meta'
import { PrismaService } from '@/prisma/prisma.service'
import { ReviewResponseEntity } from '@/review/entities/review-response.entity'

export interface PaginatedReviews {
	data: Review[]
	meta: Meta
}

@Injectable()
export class ReviewService {
	constructor(private readonly prismaService: PrismaService) {}

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
