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

@ApiTags('Часто задаваемые вопросы')
@Controller('faqs')
export class FaqController {
	constructor(private readonly faqService: FaqService) {}

	@ApiOperation({ summary: 'Создать новый FAQ' })
	@ApiResponse({
		status: 201,
		description: 'FAQ успешно создан',
		type: FaqDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Неверный запрос - ошибка валидации',
	})
	@Authorization(UserRole.ADMIN)
	@Post()
	public async createFaq(@Body() dto: FaqDto) {
		return this.faqService.createFaq(dto)
	}

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

	@ApiOperation({ summary: 'Частично обновить FAQ' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'ID FAQ',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiBody({ type: UpdateFaqDto })
	@ApiResponse({
		status: 200,
		description: 'FAQ успешно обновлен',
		type: FaqTransferDto,
	})
	@ApiResponse({
		status: 404,
		description: 'FAQ не найден',
	})
	@ApiResponse({
		status: 400,
		description: 'Неверный запрос - ошибка валидации',
	})
	@Authorization(UserRole.ADMIN)
	@Patch(':id')
	public async updateFaq(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
		return this.faqService.updateFaq(id, dto)
	}

	@ApiOperation({ summary: 'Полностью заменить FAQ' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'ID FAQ',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiBody({ type: UpdateFullFaqDto })
	@ApiResponse({
		status: 200,
		description: 'FAQ успешно заменен',
		type: FaqTransferDto,
	})
	@ApiResponse({
		status: 404,
		description: 'FAQ не найден',
	})
	@ApiResponse({
		status: 400,
		description: 'Неверный запрос - ошибка валидации',
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
