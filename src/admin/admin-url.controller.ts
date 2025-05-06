import { Body, Controller, Param, Patch, Post } from '@nestjs/common'
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__/client'

import { Authorization } from '@/auth/decorators/auth.decorator'
import {
	CreateUrlContainerDto,
	UpdateUrlContainerDto,
} from '@/information/url-container/dto/url-container.dto'

import { AdminService } from './admin.service'

@ApiTags('Админка - URL')
@Controller('admin/urls')
export class AdminUrlController {
	constructor(private readonly adminService: AdminService) {}

	@ApiOperation({ summary: 'Создать URL', description: 'Создать новый URL' })
	@ApiBody({
		type: CreateUrlContainerDto,
		description: 'Данные для создания URL',
		examples: {
			example1: {
				value: {
					key: 'test',
					url: 'https://example.com',
				},
			},
		},
	})
	@ApiResponse({ status: 201, description: 'URL успешно создан' })
	@ApiResponse({
		status: 400,
		description: 'Неверные данные для создания URL',
	})
	@ApiResponse({ status: 403, description: 'Доступ запрещен' })
	@Post()
	@Authorization(UserRole.ADMIN)
	public async createUrlContainer(@Body() dto: CreateUrlContainerDto) {
		return this.adminService.createUrlContainer(dto)
	}

	@ApiOperation({
		summary: 'Обновить URL',
		description: 'Обновить существующий URL',
	})
	@ApiParam({
		name: 'key',
		description: 'Ключ для обновления URL',
		type: String,
	})
	@ApiBody({
		type: UpdateUrlContainerDto,
		description: 'Данные для обновления URL',
		examples: {
			example1: {
				value: {
					url: 'https://example.com',
				},
			},
		},
	})
	@ApiResponse({ status: 200, description: 'URL успешно обновлен' })
	@ApiResponse({ status: 404, description: 'URL не найден' })
	@ApiResponse({ status: 403, description: 'Доступ запрещен' })
	@ApiResponse({
		status: 400,
		description: 'Неверные данные для обновления URL',
	})
	@Patch(':key')
	@Authorization(UserRole.ADMIN)
	public async updateUrlContainer(
		@Param('key') key: string,
		@Body() dto: UpdateUrlContainerDto,
	) {
		return this.adminService.updateUrlContainer(key, dto)
	}
}
