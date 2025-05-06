import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { UserModule } from '@/core/user/user.module'
import { MailService } from '@/libs/mail/mail.service'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module'
import { SessionModule } from './session/session.module'
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module'

@Module({
	imports: [
		forwardRef(() => UserModule),
		ConfigModule,
		EmailConfirmationModule,
		TwoFactorAuthModule,
		SessionModule,
	],
	controllers: [AuthController],
	providers: [AuthService, MailService],
	exports: [AuthService],
})
export class AuthModule {}
