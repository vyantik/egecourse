import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__'

import { Authorization } from '@/auth/decorators/auth.decorator'

import { ApplicationService } from './application.service'
import { ApplicationDto } from './dto/application.dto'

@ApiTags('Заявки')
@Controller('applications')
export class ApplicationController {
	constructor(private readonly applicationService: ApplicationService) {}

	@Post()
	@Authorization()
	@ApiOperation({ summary: 'Создание заявки' })
	@ApiResponse({ status: 201, description: 'Заявка успешно создана' })
	@ApiBody({ type: ApplicationDto })
	public async createApplication(@Body() dto: ApplicationDto) {
		return this.applicationService.createApplication(dto)
	}
}
