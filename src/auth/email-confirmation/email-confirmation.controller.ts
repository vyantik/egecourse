import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'

import { UserResponseEntity } from '@/user/entities/user-response.entity'

import { ConfirmationDto } from './dto/confirmation.dto'
import { EmailConfirmationService } from './email-confirmation.service'

@ApiTags('Подтверждение email')
@Controller('auth/email-confirmation')
export class EmailConfirmationController {
	constructor(
		private readonly emailConfirmationService: EmailConfirmationService,
	) {}

	@ApiOperation({ summary: 'Подтвердить email с помощью токена' })
	@ApiBody({ type: ConfirmationDto })
	@ApiResponse({
		status: 200,
		description: 'Email успешно подтвержден',
		type: UserResponseEntity,
	})
	@ApiResponse({ status: 400, description: 'Токен истек' })
	@ApiResponse({
		status: 404,
		description: 'Токен или пользователь не найден',
	})
	@Post()
	@HttpCode(HttpStatus.OK)
	public async newVerification(
		@Req() req: Request,
		@Body() dto: ConfirmationDto,
	) {
		return this.emailConfirmationService.newVerification(req, dto)
	}
}
