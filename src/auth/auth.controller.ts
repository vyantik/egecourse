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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: 'Register a new user' })
	@ApiBody({ type: RegisterDto })
	@ApiResponse({
		status: 201,
		description: 'User successfully registered. Email verification sent.',
		schema: {
			properties: {
				message: { type: 'string' },
			},
		},
	})
	@ApiResponse({ status: 409, description: 'Email already in use' })
	@Post('register')
	@HttpCode(HttpStatus.OK)
	public async register(@Req() req: Request, @Body() dto: RegisterDto) {
		return this.authService.register(req, dto)
	}

	@ApiOperation({ summary: 'User login' })
	@ApiBody({ type: LoginDto })
	@ApiResponse({
		status: 200,
		description: 'User successfully logged in',
		type: UserEntity,
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized - Invalid credentials or email not verified',
	})
	@Post('login')
	@HttpCode(HttpStatus.OK)
	public async login(@Req() req: Request, @Body() dto: LoginDto) {
		return this.authService.login(req, dto)
	}

	@ApiOperation({ summary: 'User logout' })
	@ApiResponse({
		status: 200,
		description: 'User successfully logged out',
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
