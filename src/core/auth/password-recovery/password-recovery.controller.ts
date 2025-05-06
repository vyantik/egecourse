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

@ApiTags('Восстановление пароля')
@Controller('auth/password-recovery')
export class PasswordRecoveryController {
	constructor(
		private readonly passwordRecoveryService: PasswordRecoveryService,
	) {}

	@ApiOperation({ summary: 'Запросить письмо для сброса пароля' })
	@ApiBody({ type: ResetPasswordDto })
	@ApiResponse({
		status: 200,
		description: 'Письмо для сброса пароля успешно отправлено',
		schema: {
			type: 'boolean',
			example: true,
		},
	})
	@ApiResponse({ status: 404, description: 'Пользователь не найден' })
	@Post('reset')
	@HttpCode(HttpStatus.OK)
	public async resetPassword(@Body() dto: ResetPasswordDto) {
		return this.passwordRecoveryService.resetPassword(dto)
	}

	@ApiOperation({
		summary: 'Установить новый пароль с помощью токена сброса',
	})
	@ApiParam({
		name: 'token',
		description: 'Токен сброса пароля, полученный по email',
		type: 'string',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@ApiBody({ type: NewPasswordDto })
	@ApiResponse({
		status: 200,
		description: 'Пароль успешно обновлен',
		schema: {
			type: 'boolean',
			example: true,
		},
	})
	@ApiResponse({ status: 400, description: 'Токен истек' })
	@ApiResponse({
		status: 404,
		description: 'Токен или пользователь не найден',
	})
	@Post('new/:token')
	@HttpCode(HttpStatus.OK)
	public async newPassword(
		@Body() dto: NewPasswordDto,
		@Param('token') token: string,
	) {
		return this.passwordRecoveryService.newPassword(dto, token)
	}
}
