import { forwardRef, Module } from '@nestjs/common'

import { MailService } from '@/libs/mail/mail.service'
import { UserModule } from '@/user/user.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module'
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service'

@Module({
	imports: [
		forwardRef(() => EmailConfirmationModule),
		forwardRef(() => UserModule),
	],
	controllers: [AuthController],
	providers: [AuthService, MailService, TwoFactorAuthService],
	exports: [AuthService],
})
export class AuthModule {}
