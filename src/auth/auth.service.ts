import {
	BadRequestException,
	ConflictException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthMethod } from '@prisma/__generated__'
import { verify } from 'argon2'
import validate from 'deep-email-validator'
import { Request, Response } from 'express'

import { UserService } from '@/user/user.service'

import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service'
import { SessionService } from './session/session.service'
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service'

/**
 * Сервис аутентификации
 * Предоставляет методы для регистрации, входа и выхода пользователей,
 * а также управления сессиями и двухфакторной аутентификацией
 */
@Injectable()
export class AuthService {
	/**
	 * Конструктор сервиса аутентификации
	 * @param userService - Сервис для работы с пользователями
	 * @param configService - Сервис конфигурации
	 * @param emailConfirmationService - Сервис подтверждения email
	 * @param twoFactorAuthService - Сервис двухфакторной аутентификации
	 * @param sessionService - Сервис управления сессиями
	 */
	public constructor(
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly emailConfirmationService: EmailConfirmationService,
		private readonly twoFactorAuthService: TwoFactorAuthService,
		private readonly sessionService: SessionService,
	) {}

	/**
	 * Регистрация нового пользователя
	 * @param req - Объект запроса Express
	 * @param dto - DTO с данными для регистрации
	 * @returns Promise с сообщением об успешной регистрации
	 * @throws BadRequestException если email невалидный
	 * @throws ConflictException если пользователь с таким email уже существует
	 */
	public async register(req: Request, dto: RegisterDto) {
		const validateEmail = await validate(dto.email)

		if (!validateEmail.valid) {
			throw new BadRequestException('Неверный формат email адреса')
		}

		const isExists = await this.userService.findByEmail(dto.email)

		if (isExists) {
			throw new ConflictException(
				'Пользователь с таким email адресом уже существует',
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
				'Вы успешно зарегистрировались. Пожалуйста, подтвердите ваш email. Сообщение было отправлено на ваш адрес электронной почты.',
		}
	}

	/**
	 * Вход пользователя в систему
	 * @param req - Объект запроса Express
	 * @param dto - DTO с данными для входа
	 * @returns Promise с данными пользователя или сообщением о необходимости двухфакторной аутентификации
	 * @throws NotFoundException если пользователь не найден
	 * @throws UnauthorizedException если пароль неверный или email не подтвержден
	 */
	public async login(req: Request, dto: LoginDto) {
		const user = await this.userService.findByEmail(dto.email)

		if (!user || !user.password) {
			throw new NotFoundException('Пользователь не найден')
		}

		const isValidPassport = await verify(user.password, dto.password)

		if (!isValidPassport) {
			throw new UnauthorizedException('Неверный пароль')
		}

		if (!user.isVerified) {
			await this.emailConfirmationService.sendVerificationToken(
				user.email,
			)
			throw new UnauthorizedException(
				'Ваш email не подтвержден. Пожалуйста, проверьте почту и подтвердите адрес.',
			)
		}

		if (user.isTwoFactorEnabled) {
			if (!dto.code) {
				await this.twoFactorAuthService.sendTwoFactorToken(user.email)

				return {
					message:
						'Проверьте вашу почту. Требуется код двухфакторной аутентификации.',
				}
			}

			await this.twoFactorAuthService.validateTwoFactorToken(
				user.email,
				dto.code,
			)
		}

		return this.sessionService.saveSession(req, user)
	}

	/**
	 * Выход пользователя из системы
	 * @param req - Объект запроса Express
	 * @param res - Объект ответа Express
	 */
	public async logout(req: Request, res: Response): Promise<void> {
		return this.sessionService.logout(req, res)
	}
}
