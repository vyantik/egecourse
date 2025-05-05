import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'

import { FaqPaginationResponseDto } from './dto/faq-pagination-response.dto'
import { FaqService } from './faq.service'

@ApiTags('Часто задаваемые вопросы')
@Controller('faqs')
export class FaqController {
	constructor(private readonly faqService: FaqService) {}

	@ApiOperation({ summary: 'Получить все FAQ с пагинацией' })
	@ApiQuery({
		name: 'page',
		required: false,
		type: Number,
		description: 'Номер страницы (начиная с 1)',
		example: 1,
	})
	@ApiQuery({
		name: 'limit',
		required: false,
		type: Number,
		description: 'Количество элементов на странице',
		example: 10,
	})
	@ApiResponse({
		status: 200,
		description: 'Возвращает FAQ с метаданными пагинации',
		type: FaqPaginationResponseDto,
	})
	@Get()
	public async getFaq(
		@Query('page') page?: number,
		@Query('limit') limit?: number,
	) {
		return this.faqService.getFaqs(page, limit)
	}
}
