import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

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
}
