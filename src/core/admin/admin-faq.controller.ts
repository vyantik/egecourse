import { Body, Controller, Param, Patch, Post, Put } from '@nestjs/common'
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__/client'

import { Authorization } from '@/core/auth/decorators/auth.decorator'
import { FaqTransferDto } from '@/information/faq/dto/faq-transfer.dto'
import { FaqDto } from '@/information/faq/dto/faq.dto'
import {
	UpdateFaqDto,
	UpdateFullFaqDto,
} from '@/information/faq/dto/update-faq.dto'

import { AdminService } from './admin.service'

@ApiTags('Админка - FAQ')
@Controller('admin/faq')
export class AdminFaqController {
	constructor(private readonly adminService: AdminService) {}

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
		return this.adminService.createFaq(dto)
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
		return this.adminService.updateFaq(id, dto)
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
		return this.adminService.replaceFaq(id, dto)
	}
}
