import { Injectable, NotFoundException } from '@nestjs/common'

import { Meta } from '@/libs/common/utils/meta'
import { PrismaService } from '@/prisma/prisma.service'

import { FaqDto } from './dto/faq.dto'
import { UpdateFaqDto, UpdateFullFaqDto } from './dto/update-faq.dto'

@Injectable()
export class FaqService {
	constructor(private readonly prismaService: PrismaService) {}

	async createFaq(dto: FaqDto): Promise<FaqDto> {
		return this.prismaService.faq.create({
			data: {
				...dto,
			},
		})
	}

	async getFaqs(
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

	async updateFaq(id: string, dto: UpdateFaqDto) {
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

	async replaceFaq(id: string, dto: UpdateFullFaqDto) {
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
