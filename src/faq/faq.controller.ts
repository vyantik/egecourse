import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Put,
	Query,
} from '@nestjs/common'
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__'

import { Authorization } from '@/auth/decorators/auth.decorator'

import { FaqPaginationResponseDto } from './dto/faq-pagination-response.dto'
import { FaqTransferDto } from './dto/faq-transfer.dto'
import { FaqDto } from './dto/faq.dto'
import { UpdateFaqDto, UpdateFullFaqDto } from './dto/update-faq.dto'
import { FaqService } from './faq.service'

@ApiTags('faqs')
@Controller('faqs')
export class FaqController {
	constructor(private readonly faqService: FaqService) {}

	@ApiOperation({ summary: 'Create a new FAQ entry' })
	@ApiResponse({
		status: 201,
		description: 'FAQ entry successfully created',
		type: FaqDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad request - validation error',
	})
	@Authorization(UserRole.ADMIN)
	@Post()
	public async createFaq(@Body() dto: FaqDto) {
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
	public async getFaq(
		@Query('page') page?: number,
		@Query('limit') limit?: number,
	) {
		return this.faqService.getFaqs(page, limit)
	}

	@ApiOperation({ summary: 'Update part of an FAQ entry' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'FAQ ID',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiBody({ type: UpdateFaqDto })
	@ApiResponse({
		status: 200,
		description: 'FAQ entry successfully updated',
		type: FaqTransferDto,
	})
	@ApiResponse({
		status: 404,
		description: 'FAQ not found',
	})
	@ApiResponse({
		status: 400,
		description: 'Bad request - validation error',
	})
	@Authorization(UserRole.ADMIN)
	@Patch(':id')
	public async updateFaq(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
		return this.faqService.updateFaq(id, dto)
	}

	@ApiOperation({ summary: 'Replace an entire FAQ entry' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'FAQ ID',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiBody({ type: UpdateFullFaqDto })
	@ApiResponse({
		status: 200,
		description: 'FAQ entry successfully replaced',
		type: FaqTransferDto,
	})
	@ApiResponse({
		status: 404,
		description: 'FAQ not found',
	})
	@ApiResponse({
		status: 400,
		description: 'Bad request - validation error',
	})
	@Authorization(UserRole.ADMIN)
	@Put(':id')
	public async replaceFaq(
		@Param('id') id: string,
		@Body() dto: UpdateFullFaqDto,
	) {
		return this.faqService.replaceFaq(id, dto)
	}
}
