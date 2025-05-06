import { Controller, Get, Param, Query } from '@nestjs/common'
import {
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'

import { WebinarPaginationResponseDto } from './dto/webinar-pagination-response.dto'
import { Webinar } from './entities/webinar.entity'
import { WebinarService } from './webinar.service'

@ApiTags('Вебинары')
@Controller('webinars')
export class WebinarController {
	constructor(private readonly webinarService: WebinarService) {}

	@ApiOperation({ summary: 'Получить все вебинары' })
	@ApiQuery({
		name: 'page',
		required: false,
		type: Number,
		example: 1,
	})
	@ApiQuery({
		name: 'limit',
		required: false,
		type: Number,
		example: 10,
	})
	@ApiResponse({
		status: 200,
		description: 'Вебинары успешно получены',
		type: WebinarPaginationResponseDto,
	})
	@Get()
	async getWebinars(
		@Query('page') page?: number,
		@Query('limit') limit?: number,
	) {
		return this.webinarService.getWebinars(page, limit)
	}

	@ApiOperation({ summary: 'Получить вебинар по id' })
	@ApiParam({
		name: 'id',
		required: true,
		type: String,
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@ApiResponse({
		status: 200,
		description: 'Вебинар успешно получен',
		type: Webinar,
	})
	@ApiResponse({
		status: 404,
		description: 'Вебинар не найден',
	})
	@Get(':id')
	async getWebinarById(@Param('id') id: string) {
		return this.webinarService.getWebinarById(id)
	}
}
