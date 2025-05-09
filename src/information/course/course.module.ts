import { Module } from '@nestjs/common'

import { UserModule } from '@/core/user/user.module'

import { CourseController } from './course.controller'
import { CourseService } from './course.service'

@Module({
	imports: [UserModule],
	controllers: [CourseController],
	providers: [CourseService],
	exports: [CourseService],
})
export class CourseModule {}
