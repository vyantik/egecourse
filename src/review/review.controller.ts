import { Controller, Get, Param, Query } from '@nestjs/common'
import {
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'

import { ReviewService } from './review.service'

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@Get(':id')
	@ApiOperation({ summary: 'Get review by ID' })
	@ApiParam({
		name: 'id',
		description: 'Review ID',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@ApiResponse({ status: 200, description: 'Review found successfully' })
	@ApiResponse({ status: 404, description: 'Review not found' })
	public async getReview(@Param('id') reviewId: string) {
		return this.reviewService.getReview(reviewId)
	}

	@Get()
	@ApiOperation({ summary: 'Get all reviews with pagination' })
	@ApiQuery({
		name: 'page',
		description: 'Page number (starts from 1)',
		required: false,
		type: Number,
		example: 1,
	})
	@ApiQuery({
		name: 'limit',
		description: 'Number of items per page',
		required: false,
		type: Number,
		example: 10,
	})
	@ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
	public async getReviews(
		@Query('page') page?: number,
		@Query('limit') limit?: number,
	) {
		return this.reviewService.getReviews(page, limit)
	}
}
