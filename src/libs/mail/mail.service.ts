import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'

import {
	ConfirmationTemplate,
	ResetPasswordTemplate,
	TwoFactorAuthTemplate,
} from './templates'

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService,
	) {}

	public async sendConfirmationEmail(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(ConfirmationTemplate({ domain, token }))

		return await this.sendMail(email, 'Email confirmation', html)
	}

	public async sendPasswordResetEmail(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(ResetPasswordTemplate({ domain, token }))

		return await this.sendMail(email, 'Password reset', html)
	}

	public async sendTwoFactorTokenEmail(email: string, token: string) {
		const html = await render(TwoFactorAuthTemplate({ token }))

		return await this.sendMail(email, 'Confirming your identity', html)
	}

	private async sendMail(email: string, subject: string, html: string) {
		try {
			return await this.mailerService.sendMail({
				to: email,
				subject,
				html,
			})
		} catch (error) {
			console.error(`Failed to send email to ${email}:`, error.message)
			throw new Error(`Failed to send email: ${error.message}`)
		}
	}
}
