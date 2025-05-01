import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'

import {
	CreateUrlContainerDto,
	UpdateUrlContainerDto,
} from './dto/url-container.dto'
import { UrlContainerService } from './url-container.service'

@ApiTags('Url container')
@Controller('url-container')
export class UrlContainerController {
	constructor(private readonly urlContainerService: UrlContainerService) {}

	@ApiOperation({
		summary: 'Get a url',
		description: 'Получить URL по его идентификатору',
	})
	@ApiParam({ name: 'id', description: 'Идентификатор URL', type: String })
	@ApiResponse({ status: 200, description: 'URL успешно найден' })
	@ApiResponse({ status: 404, description: 'URL не найден' })
	@Get(':id')
	public async getUrlContainer(@Param('id') id: string) {
		return this.urlContainerService.getUrlContainer(id)
	}

	@ApiOperation({ summary: 'Create a url', description: 'Создать новый URL' })
	@ApiBody({
		type: CreateUrlContainerDto,
		description: 'Данные для создания URL',
	})
	@ApiResponse({ status: 201, description: 'URL успешно создан' })
	@ApiResponse({
		status: 400,
		description: 'Неверные данные для создания URL',
	})
	@Post()
	public async createUrlContainer(@Body() dto: CreateUrlContainerDto) {
		return this.urlContainerService.createUrlContainer(dto)
	}

	@ApiOperation({
		summary: 'Update a url',
		description: 'Обновить существующий URL',
	})
	@ApiParam({
		name: 'id',
		description: 'Идентификатор URL для обновления',
		type: String,
	})
	@ApiBody({
		type: UpdateUrlContainerDto,
		description: 'Данные для обновления URL',
	})
	@ApiResponse({ status: 200, description: 'URL успешно обновлен' })
	@ApiResponse({ status: 404, description: 'URL не найден' })
	@ApiResponse({
		status: 400,
		description: 'Неверные данные для обновления URL',
	})
	@Patch(':id')
	public async updateUrlContainer(
		@Param('id') id: string,
		@Body() dto: UpdateUrlContainerDto,
	) {
		return this.urlContainerService.updateUrlContainer(id, dto)
	}
}
