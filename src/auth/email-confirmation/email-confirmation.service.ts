import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { TokenType } from '@prisma/__generated__'
import { Request } from 'express'
import { v4 } from 'uuid'

import { MailService } from '@/libs/mail/mail.service'
import { PrismaService } from '@/prisma/prisma.service'
import { UserService } from '@/user/user.service'

import { SessionService } from '../session/session.service'

import { ConfirmationDto } from './dto/confirmation.dto'

/**
 * Сервис подтверждения email
 * Предоставляет методы для генерации, отправки и валидации токенов подтверждения email
 */
@Injectable()
export class EmailConfirmationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly userService: UserService,
		private readonly sessionService: SessionService,
	) {}

	public async newVerification(req: Request, dto: ConfirmationDto) {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token: dto.token,
				type: TokenType.VERIFICATION,
			},
		})

		if (!existingToken) {
			throw new NotFoundException('Токен не найден')
		}

		const isExpired = new Date(existingToken.expiresIn) < new Date()

		if (isExpired) {
			throw new BadRequestException('Срок действия токена истек')
		}

		const existingUser = await this.userService.findByEmail(
			existingToken.email,
		)

		if (!existingUser) {
			throw new NotFoundException('Пользователь не найден')
		}

		await this.prismaService.user.update({
			where: {
				id: existingUser.id,
			},
			data: {
				isVerified: true,
			},
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.VERIFICATION,
			},
		})

		return this.sessionService.saveSession(req, existingUser)
	}

	public async sendVerificationToken(email: string) {
		const verificationToken = await this.generateVerificationToken(email)

		await this.mailService.sendConfirmationEmail(
			verificationToken.email,
			verificationToken.token,
		)

		return true
	}

	private async generateVerificationToken(email: string) {
		const token = v4()
		const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.VERIFICATION,
			},
		})

		if (existingToken) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.VERIFICATION,
				},
			})
		}

		const verificationToken = await this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.VERIFICATION,
			},
		})

		return verificationToken
	}
}
