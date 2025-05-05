import { Module } from '@nestjs/common'

import { CourseModule } from '@/course/course.module'
import { FaqModule } from '@/faq/faq.module'
import { TeacherModule } from '@/teacher/teacher.module'
import { UrlContainerModule } from '@/url-container/url-container.module'
import { UserModule } from '@/user/user.module'
import { WebinarModule } from '@/webinar/webinar.module'

import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'

@Module({
	imports: [
		WebinarModule,
		UserModule,
		UrlContainerModule,
		TeacherModule,
		FaqModule,
		CourseModule,
	],
	controllers: [AdminController],
	providers: [AdminService],
	exports: [AdminService],
})
export class AdminModule {}
