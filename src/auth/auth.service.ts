import {
	ConflictException,
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthMethod, User } from '@prisma/__generated__'
import { verify } from 'argon2'
import { plainToInstance } from 'class-transformer'
import { Request, Response } from 'express'

import { UserResponseEntity } from '@/user/entities/user-response.entity'
import { UserService } from '@/user/user.service'

import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service'
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service'

@Injectable()
export class AuthService {
	public constructor(
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly emailConfirmationService: EmailConfirmationService,
		private readonly twoFactorAuthService: TwoFactorAuthService,
	) {}

	public async register(req: Request, dto: RegisterDto) {
		const isExists = await this.userService.findByEmail(dto.email)

		if (isExists) {
			throw new ConflictException(
				'Conflict exception. Please use another email address or login',
			)
		}

		const newUser = await this.userService.create(
			dto.email,
			dto.password,
			dto.name,
			dto.surname,
			dto.patronymic,
			'',
			AuthMethod.CREDENTIALS,
			false,
		)

		await this.emailConfirmationService.sendVerificationToken(newUser.email)

		return {
			message:
				'You have successfully registered. Please confirm your email. The message has been sent to your email address.',
		}
	}

	public async login(req: Request, dto: LoginDto) {
		const user = await this.userService.findByEmail(dto.email)

		if (!user || !user.password) {
			throw new NotFoundException('User not found.')
		}

		const isValidPassport = await verify(user.password, dto.password)

		if (!isValidPassport) {
			throw new UnauthorizedException('Incorrect password')
		}

		if (!user.isVerified) {
			await this.emailConfirmationService.sendVerificationToken(
				user.email,
			)
			throw new UnauthorizedException(
				'Your email is not confirmed. Please check your mail and confirm the address.',
			)
		}

		if (user.isTwoFactorEnabled) {
			if (!dto.code) {
				await this.twoFactorAuthService.sendTwoFactorToken(user.email)

				return {
					message:
						'Check your email. Two-factor authentication code required.',
				}
			}

			await this.twoFactorAuthService.validateTwoFactorToken(
				user.email,
				dto.code,
			)
		}

		return this.saveSession(req, user)
	}

	public async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException('Session not deleted'),
					)
				}

				res.clearCookie(
					this.configService.getOrThrow<string>('SESSION_NAME'),
				)
				resolve()
			})
		})
	}

	public async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id

			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException('Session not saved.'),
					)
				}

				const transformedUser = plainToInstance(
					UserResponseEntity,
					user,
					{
						excludeExtraneousValues: false,
					},
				)

				resolve(transformedUser)
			})
		})
	}
}
