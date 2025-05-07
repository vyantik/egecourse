import { Module } from '@nestjs/common'

import { ApplicationModule } from '@/application/application.module'
import { UserModule } from '@/core/user/user.module'
import { CourseModule } from '@/information/course/course.module'
import { FaqModule } from '@/information/faq/faq.module'
import { ReviewModule } from '@/information/review/review.module'
import { TeacherModule } from '@/information/teacher/teacher.module'
import { UrlContainerModule } from '@/information/url-container/url-container.module'
import { WebinarModule } from '@/information/webinar/webinar.module'

import { AdminCourseController } from './admin-course.controller'
import { AdminFaqController } from './admin-faq.controller'
import { AdminTeacherController } from './admin-teacher.controller'
import { AdminUrlController } from './admin-url.controller'
import { AdminWebinarController } from './admin-webinar.controller'
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
		ReviewModule,
		ApplicationModule,
	],
	controllers: [
		AdminController,
		AdminCourseController,
		AdminFaqController,
		AdminTeacherController,
		AdminUrlController,
		AdminWebinarController,
	],
	providers: [AdminService],
	exports: [AdminService],
})
export class AdminModule {}
