import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'

import { UserEntity } from '@/user/entities/user.entity'

import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: 'Регистрация нового пользователя' })
	@ApiBody({ type: RegisterDto })
	@ApiResponse({
		status: 201,
		description:
			'Пользователь успешно зарегистрирован. Отправлено письмо для подтверждения email.',
		schema: {
			properties: {
				message: { type: 'string' },
			},
		},
	})
	@ApiResponse({ status: 409, description: 'Email уже используется' })
	@Post('register')
	@HttpCode(HttpStatus.OK)
	public async register(@Req() req: Request, @Body() dto: RegisterDto) {
		return this.authService.register(req, dto)
	}

	@ApiOperation({ summary: 'Вход пользователя' })
	@ApiBody({ type: LoginDto })
	@ApiResponse({
		status: 200,
		description: 'Пользователь успешно вошел в систему',
		type: UserEntity,
	})
	@ApiResponse({
		status: 401,
		description:
			'Неавторизован - Неверные учетные данные или email не подтвержден',
	})
	@Post('login')
	@HttpCode(HttpStatus.OK)
	public async login(@Req() req: Request, @Body() dto: LoginDto) {
		return this.authService.login(req, dto)
	}

	@ApiOperation({ summary: 'Выход пользователя' })
	@ApiResponse({
		status: 200,
		description: 'Пользователь успешно вышел из системы',
	})
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	public async logout(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.logout(req, res)
	}
}
