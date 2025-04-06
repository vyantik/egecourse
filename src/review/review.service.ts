import { Injectable, NotFoundException } from '@nestjs/common'
import { Review } from '@prisma/__generated__'

import { Meta } from '@/libs/common/utils/meta'
import { PrismaService } from '@/prisma/prisma.service'

export interface PaginatedReviews {
	data: Review[]
	meta: Meta
}

@Injectable()
export class ReviewService {
	constructor(private readonly prismaService: PrismaService) {}

	public async getReview(reviewId: string): Promise<Review> {
		const review = await this.prismaService.review.findUnique({
			where: {
				id: reviewId,
			},
		})

		if (!review) {
			throw new NotFoundException('Review not found')
		}

		return review
	}

	public async getReviews(
		page?: number,
		limit?: number,
	): Promise<Review[] | PaginatedReviews> {
		if (!page || !limit) {
			return this.prismaService.review.findMany({
				orderBy: {
					createdAt: 'desc',
				},
			})
		}

		const skip = (page - 1) * limit

		const [faqs, total] = await Promise.all([
			this.prismaService.review.findMany({
				skip,
				take: limit,
				orderBy: {
					createdAt: 'desc',
				},
			}),
			this.prismaService.review.count(),
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
