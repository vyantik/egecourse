import { Injectable, NotFoundException } from '@nestjs/common'

import { Meta } from '@/libs/common/utils/meta'
import { PrismaService } from '@/prisma/prisma.service'

import { FaqDto } from './dto/faq.dto'
import { UpdateFaqDto, UpdateFullFaqDto } from './dto/update-faq.dto'

/**
 * Сервис для управления часто задаваемыми вопросами (FAQ)
 * Предоставляет методы для создания, получения и обновления FAQ
 */
@Injectable()
export class FaqService {
	/**
	 * Конструктор сервиса FAQ
	 * @param prismaService - Сервис для работы с базой данных
	 */
	constructor(private readonly prismaService: PrismaService) {}

	/**
	 * Создает новый FAQ
	 * @param dto - DTO с данными FAQ (вопрос и ответ)
	 * @returns Promise с созданным FAQ
	 */
	public async createFaq(dto: FaqDto): Promise<FaqDto> {
		return this.prismaService.faq.create({
			data: {
				...dto,
			},
		})
	}

	/**
	 * Получает список всех FAQ с опциональной пагинацией
	 * @param page - Номер страницы (опционально)
	 * @param limit - Количество элементов на странице (опционально)
	 * @returns Promise с массивом FAQ или объектом с данными и метаинформацией
	 *
	 * Если параметры пагинации не указаны, возвращает все FAQ.
	 * Если указаны page и limit, возвращает объект с FAQ и метаданными пагинации.
	 * В обоих случаях FAQ сортируются по дате создания (сначала новые).
	 */
	public async getFaqs(
		page?: number,
		limit?: number,
	): Promise<FaqDto[] | { data: FaqDto[]; meta: Meta }> {
		if (!page || !limit) {
			return this.prismaService.faq.findMany({
				orderBy: {
					createdAt: 'desc',
				},
			})
		}

		const skip = (page - 1) * limit

		const [faqs, total] = await Promise.all([
			this.prismaService.faq.findMany({
				skip,
				take: limit,
				orderBy: {
					createdAt: 'desc',
				},
			}),
			this.prismaService.faq.count(),
		])

		return {
			data: faqs,
			meta: {
				total,
				page,
				limit,
				lastPage: Math.ceil(total / limit),
			},
		}
	}

	/**
	 * Частично обновляет FAQ
	 * @param id - Уникальный идентификатор FAQ
	 * @param dto - DTO с обновляемыми полями
	 * @returns Promise с обновленным FAQ
	 * @throws NotFoundException если FAQ не найден
	 */
	public async updateFaq(id: string, dto: UpdateFaqDto) {
		const faq = await this.prismaService.faq.findUnique({
			where: { id },
		})

		if (!faq) {
			throw new NotFoundException('FAQ not found')
		}

		return this.prismaService.faq.update({
			where: { id },
			data: dto,
		})
	}

	/**
	 * Полностью заменяет FAQ
	 * @param id - Уникальный идентификатор FAQ
	 * @param dto - DTO с полными данными для замены
	 * @returns Promise с обновленным FAQ
	 * @throws NotFoundException если FAQ не найден
	 */
	public async replaceFaq(id: string, dto: UpdateFullFaqDto) {
		const faq = await this.prismaService.faq.findUnique({
			where: { id },
		})

		if (!faq) {
			throw new NotFoundException('FAQ not found')
		}

		return this.prismaService.faq.update({
			where: { id },
			data: dto,
		})
	}
}
