import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { Authorization } from '@/core/auth/decorators/auth.decorator'
import { Authorized } from '@/core/auth/decorators/authorized.decorator'

import { ApplicationService } from './application.service'
import { ApplicationDto } from './dto/application.dto'

@ApiTags('Заявки')
@Controller('applications')
export class ApplicationController {
	constructor(private readonly applicationService: ApplicationService) {}

	@ApiOperation({ summary: 'Создание заявки' })
	@ApiResponse({ status: 201, description: 'Заявка успешно создана' })
	@ApiBody({ type: ApplicationDto })
	@Authorization()
	@HttpCode(HttpStatus.CREATED)
	@Post()
	public async createApplication(
		@Body() dto: ApplicationDto,
		@Authorized('id') id: string,
	) {
		return this.applicationService.createApplication(dto, id)
	}
}
