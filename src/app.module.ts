import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { AdminModule } from './admin/admin.module'
import { ApplicationModule } from './application/application.module'
import { AuthModule } from './auth/auth.module'
import { EmailConfirmationModule } from './auth/email-confirmation/email-confirmation.module'
import { PasswordRecoveryModule } from './auth/password-recovery/password-recovery.module'
import { TwoFactorAuthModule } from './auth/two-factor-auth/two-factor-auth.module'
import { FileSystemModule } from './file-system/file-system.module'
import { CourseModule } from './information/course/course.module'
import { FaqModule } from './information/faq/faq.module'
import { ReviewModule } from './information/review/review.module'
import { TeacherModule } from './information/teacher/teacher.module'
import { UrlContainerModule } from './information/url-container/url-container.module'
import { WebinarModule } from './information/webinar/webinar.module'
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util'
import { MailModule } from './libs/mail/mail.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true,
		}),
		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 20,
			},
		]),
		PrismaModule,
		AuthModule,
		UserModule,
		MailModule,
		EmailConfirmationModule,
		PasswordRecoveryModule,
		TwoFactorAuthModule,
		FileSystemModule,
		TeacherModule,
		FaqModule,
		CourseModule,
		ReviewModule,
		UrlContainerModule,
		ApplicationModule,
		WebinarModule,
		AdminModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
