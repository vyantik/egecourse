import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__/client'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { CreateWebinarDto } from '@/information/webinar/dto/create-webinar.dto'
import { Webinar } from '@/information/webinar/entities/webinar.entity'

import { AdminService } from './admin.service'

@ApiTags('Админка - Вебинары')
@Controller('admin/webinars')
export class AdminWebinarController {
	constructor(private readonly adminService: AdminService) {}

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
}
