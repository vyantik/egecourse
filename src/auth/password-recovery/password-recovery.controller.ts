import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Post,
} from '@nestjs/common'
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'

import { NewPasswordDto } from './dto/new-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { PasswordRecoveryService } from './password-recovery.service'

@ApiTags('Password-Recovery')
@Controller('auth/password-recovery')
export class PasswordRecoveryController {
	constructor(
		private readonly passwordRecoveryService: PasswordRecoveryService,
	) {}

	@ApiOperation({ summary: 'Request password reset email' })
	@ApiBody({ type: ResetPasswordDto })
	@ApiResponse({
		status: 200,
		description: 'Password reset email sent successfully',
		schema: {
			type: 'boolean',
			example: true,
		},
	})
	@ApiResponse({ status: 404, description: 'User not found' })
	@Post('reset')
	@HttpCode(HttpStatus.OK)
	public async resetPassword(@Body() dto: ResetPasswordDto) {
		return this.passwordRecoveryService.resetPassword(dto)
	}

	@ApiOperation({ summary: 'Set new password using reset token' })
	@ApiParam({
		name: 'token',
		description: 'Password reset token received via email',
		type: 'string',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@ApiBody({ type: NewPasswordDto })
	@ApiResponse({
		status: 200,
		description: 'Password successfully updated',
		schema: {
			type: 'boolean',
			example: true,
		},
	})
	@ApiResponse({ status: 400, description: 'Token expired' })
	@ApiResponse({ status: 404, description: 'Token or user not found' })
	@Post('new/:token')
	@HttpCode(HttpStatus.OK)
	public async newPassword(
		@Body() dto: NewPasswordDto,
		@Param('token') token: string,
	) {
		return this.passwordRecoveryService.newPassword(dto, token)
	}
}
