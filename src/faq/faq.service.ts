import { Injectable } from '@nestjs/common'

import { Meta } from '@/libs/common/utils/meta'
import { PrismaService } from '@/prisma/prisma.service'

import { faqDto } from './dto/faq.dto'

@Injectable()
export class FaqService {
	constructor(private readonly prismaService: PrismaService) {}

	async createFaq(dto: faqDto): Promise<faqDto> {
		return this.prismaService.faq.create({
			data: {
				...dto,
			},
		})
	}

	async getFaqs(
		page?: number,
		limit?: number,
	): Promise<faqDto[] | { data: faqDto[]; meta: Meta }> {
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
}
