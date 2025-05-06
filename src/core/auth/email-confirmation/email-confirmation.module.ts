import { forwardRef, Module } from '@nestjs/common'

import { UserModule } from '@/core/user/user.module'
import { MailModule } from '@/libs/mail/mail.module'
import { PrismaModule } from '@/prisma/prisma.module'

import { SessionModule } from '../session/session.module'

import { EmailConfirmationController } from './email-confirmation.controller'
import { EmailConfirmationService } from './email-confirmation.service'

@Module({
	imports: [
		PrismaModule,
		MailModule,
		forwardRef(() => UserModule),
		SessionModule,
	],
	controllers: [EmailConfirmationController],
	providers: [EmailConfirmationService],
	exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
