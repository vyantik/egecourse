import { Module } from '@nestjs/common'

import { ApplicationModule } from '@/application/application.module'
import { UserModule } from '@/core/user/user.module'
import { CourseModule } from '@/information/course/course.module'
import { FaqModule } from '@/information/faq/faq.module'
import { ReviewModule } from '@/information/review/review.module'
import { TeacherModule } from '@/information/teacher/teacher.module'
import { UrlContainerModule } from '@/information/url-container/url-container.module'
import { WebinarModule } from '@/information/webinar/webinar.module'

import { AdminCourseController } from './course/admin-course.controller'
import { AdminCourseService } from './course/admin-course.service'
import { AdminFaqController } from './faq/admin-faq.controller'
import { AdminFaqService } from './faq/admin-faq.service'
import { AdminTeacherController } from './teacher/admin-teacher.controller'
import { AdminTeacherService } from './teacher/admin-teacher.service'
import { AdminUrlController } from './url/admin-url.controller'
import { AdminUrlContainerService } from './url/admin-url.service'
import { AdminWebinarController } from './webinar/admin-webinar.controller'
import { AdminWebinarService } from './webinar/admin-webinar.service'

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
		AdminCourseController,
		AdminFaqController,
		AdminTeacherController,
		AdminUrlController,
		AdminWebinarController,
	],
	providers: [
		AdminCourseService,
		AdminFaqService,
		AdminTeacherService,
		AdminUrlContainerService,
		AdminWebinarService,
	],
})
export class AdminModule {}
