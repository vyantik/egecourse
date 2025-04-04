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

@ApiTags('email-confirmation')
@Controller('auth/email-confirmation')
export class EmailConfirmationController {
	constructor(
		private readonly emailConfirmationService: EmailConfirmationService,
	) {}

	@ApiOperation({ summary: 'Verify email with confirmation token' })
	@ApiBody({ type: ConfirmationDto })
	@ApiResponse({
		status: 200,
		description: 'Email successfully verified',
		type: UserResponseEntity,
	})
	@ApiResponse({ status: 400, description: 'Token expired' })
	@ApiResponse({ status: 404, description: 'Token or user not found' })
	@Post()
	@HttpCode(HttpStatus.OK)
	public async newVerification(
		@Req() req: Request,
		@Body() dto: ConfirmationDto,
	) {
		return this.emailConfirmationService.newVerification(req, dto)
	}
}
