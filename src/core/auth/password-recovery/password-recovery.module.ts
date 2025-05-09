import { Module } from '@nestjs/common'

import { UserModule } from '@/core/user/user.module'
import { MailService } from '@/libs/mail/mail.service'

import { PasswordRecoveryController } from './password-recovery.controller'
import { PasswordRecoveryService } from './password-recovery.service'

@Module({
	controllers: [PasswordRecoveryController],
	providers: [PasswordRecoveryService, MailService],
	imports: [UserModule],
})
export class PasswordRecoveryModule {}
