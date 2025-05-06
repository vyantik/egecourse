import { Module } from '@nestjs/common'

import { CourseModule } from '@/course/course.module'
import { FaqModule } from '@/faq/faq.module'
import { TeacherModule } from '@/teacher/teacher.module'
import { UrlContainerModule } from '@/url-container/url-container.module'
import { UserModule } from '@/user/user.module'
import { WebinarModule } from '@/webinar/webinar.module'

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
