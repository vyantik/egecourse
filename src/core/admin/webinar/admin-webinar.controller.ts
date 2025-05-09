import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
} from '@nestjs/common'
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { UserRole, WebinarStatus } from '@prisma/__generated__/client'

import { Authorization } from '@/core/auth/decorators/auth.decorator'
import { CreateWebinarDto } from '@/information/webinar/dto/create-webinar.dto'
import { Webinar } from '@/information/webinar/entities/webinar.entity'

import { AdminWebinarService } from './admin-webinar.service'

@ApiTags('Админка - Вебинары')
@Controller('admin/webinars')
export class AdminWebinarController {
	constructor(private readonly adminService: AdminWebinarService) {}

	@ApiOperation({ summary: 'Создать вебинар' })
	@ApiBody({ type: CreateWebinarDto })
	@ApiResponse({
		status: 201,
		description: 'Вебинар успешно создан',
		type: Webinar,
	})
	@ApiResponse({
		status: 400,
		description: 'Некорректные данные',
	})
	@Authorization(UserRole.ADMIN)
	@HttpCode(HttpStatus.CREATED)
	@Post()
	async createWebinar(@Body() dto: CreateWebinarDto) {
		return this.adminService.createWebinar(dto)
	}

	@ApiOperation({ summary: 'Обновить статус вебинара' })
	@ApiParam({
		name: 'id',
		required: true,
		type: String,
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				status: {
					type: 'string',
					enum: Object.values(WebinarStatus),
					example: WebinarStatus.CLOSED,
				},
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: 'Статус вебинара успешно обновлен',
		type: Webinar,
	})
	@ApiResponse({
		status: 404,
		description: 'Вебинар не найден',
	})
	@Authorization(UserRole.ADMIN)
	@Patch(':id/status')
	async updateWebinarStatus(
		@Param('id') id: string,
		@Body('status') status: WebinarStatus,
	) {
		return this.adminService.updateWebinarStatus(id, status)
	}
}
