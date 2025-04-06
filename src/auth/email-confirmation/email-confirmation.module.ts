import { forwardRef, Module } from '@nestjs/common'

import { AuthModule } from '@/auth/auth.module'
import { FileSystemModule } from '@/file-system/file-system.module'
import { MailService } from '@/libs/mail/mail.service'
import { UserModule } from '@/user/user.module'

import { EmailConfirmationController } from './email-confirmation.controller'
import { EmailConfirmationService } from './email-confirmation.service'

@Module({
	imports: [
		forwardRef(() => UserModule),
		forwardRef(() => AuthModule),
		FileSystemModule,
	],
	controllers: [EmailConfirmationController],
	providers: [EmailConfirmationService, MailService],
	exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
