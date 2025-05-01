import { Controller, Get, Param, Query } from '@nestjs/common'
import {
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'

import { ReviewService } from './review.service'

@ApiTags('Отзывы')
@Controller('reviews')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@Get(':id')
	@ApiOperation({ summary: 'Получить отзыв по ID' })
	@ApiParam({
		name: 'id',
		description: 'ID отзыва',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@ApiResponse({ status: 200, description: 'Отзыв успешно найден' })
	@ApiResponse({ status: 404, description: 'Отзыв не найден' })
	public async getReview(@Param('id') reviewId: string) {
		return this.reviewService.getReview(reviewId)
	}

	@Get()
	@ApiOperation({ summary: 'Получить все отзывы с пагинацией' })
	@ApiQuery({
		name: 'page',
		description: 'Номер страницы (начиная с 1)',
		required: false,
		type: Number,
		example: 1,
	})
	@ApiQuery({
		name: 'limit',
		description: 'Количество элементов на странице',
		required: false,
		type: Number,
		example: 10,
	})
	@ApiResponse({ status: 200, description: 'Отзывы успешно получены' })
	public async getReviews(
		@Query('page') page?: number,
		@Query('limit') limit?: number,
	) {
		return this.reviewService.getReviews(page, limit)
	}
}
