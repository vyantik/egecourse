import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__'

import { Authorization } from '@/auth/decorators/auth.decorator'

import {
	CreateUrlContainerDto,
	UpdateUrlContainerDto,
} from './dto/url-container.dto'
import { UrlContainerService } from './url-container.service'

@ApiTags('Контейнер URL')
@Controller('url-container')
export class UrlContainerController {
	constructor(private readonly urlContainerService: UrlContainerService) {}

	@ApiOperation({
		summary: 'Получить URL',
		description: 'Получить URL по его идентификатору',
	})
	@ApiParam({ name: 'key', description: 'Ключ URL', type: String })
	@ApiResponse({ status: 200, description: 'URL успешно найден' })
	@ApiResponse({ status: 404, description: 'URL не найден' })
	@Get(':key')
	public async getUrlContainer(@Param('key') key: string) {
		return this.urlContainerService.getUrlContainer(key)
	}

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
	@Post()
	@Authorization(UserRole.ADMIN)
	public async createUrlContainer(@Body() dto: CreateUrlContainerDto) {
		return this.urlContainerService.createUrlContainer(dto)
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
		return this.urlContainerService.updateUrlContainer(key, dto)
	}
}
