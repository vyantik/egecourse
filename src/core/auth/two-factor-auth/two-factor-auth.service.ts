import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { TokenType } from '@prisma/__generated__'

import { MailService } from '@/libs/mail/mail.service'
import { PrismaService } from '@/prisma/prisma.service'

/**
 * Сервис двухфакторной аутентификации
 * Предоставляет методы для генерации, отправки и валидации токенов двухфакторной аутентификации
 */
@Injectable()
export class TwoFactorAuthService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
	) {}

	public async validateTwoFactorToken(email: string, code: string) {
		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR,
			},
		})

		if (!existingToken) {
			throw new NotFoundException('Токен не найден')
		}

		if (existingToken.token !== code) {
			throw new BadRequestException(
				'Неверный код двухфакторной аутентификации. Пожалуйста, проверьте введенный код и попробуйте снова.',
			)
		}

		const isExpired = new Date(existingToken.expiresIn) < new Date()

		if (isExpired) {
			throw new BadRequestException(
				'Срок действия кода двухфакторной аутентификации истек. Пожалуйста, запросите новый код.',
			)
		}

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.TWO_FACTOR,
			},
		})

		return true
	}

	public async sendTwoFactorToken(email: string) {
		const twoFactorToken = await this.generateTwoFactorToken(email)

		await this.mailService.sendTwoFactorTokenEmail(
			twoFactorToken.email,
			twoFactorToken.token,
		)

		return true
	}

	private async generateTwoFactorToken(email: string) {
		const token = Math.floor(
			Math.random() * (1_000_000 - 100_000) + 100_000,
		).toString()
		const expiresIn = new Date(new Date().getTime() + 300_000)

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR,
			},
		})

		if (existingToken) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.TWO_FACTOR,
				},
			})
		}

		const twoFactorToken = await this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.TWO_FACTOR,
			},
		})

		return twoFactorToken
	}
}
