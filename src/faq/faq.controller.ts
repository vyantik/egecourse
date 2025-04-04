import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'

import { faqDto, FaqPaginationResponseDto } from './dto/faq.dto'
import { FaqService } from './faq.service'

@ApiTags('faqs')
@Controller('faqs')
export class FaqController {
	constructor(private readonly faqService: FaqService) {}

	@ApiOperation({ summary: 'Create a new FAQ entry' })
	@ApiResponse({
		status: 201,
		description: 'FAQ entry successfully created',
		type: faqDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad request - validation error',
	})
	@Post()
	async createFaq(@Body() dto: faqDto) {
		return this.faqService.createFaq(dto)
	}

	@ApiOperation({ summary: 'Get all FAQ entries with pagination' })
	@ApiQuery({
		name: 'page',
		required: false,
		type: Number,
		description: 'Page number (starts from 1)',
		example: 1,
	})
	@ApiQuery({
		name: 'limit',
		required: false,
		type: Number,
		description: 'Number of items per page',
		example: 10,
	})
	@ApiResponse({
		status: 200,
		description: 'Returns FAQ entries with pagination metadata',
		type: FaqPaginationResponseDto,
	})
	@Get()
	async getFaq(@Query('page') page?: number, @Query('limit') limit?: number) {
		return this.faqService.getFaq(page, limit)
	}
}
