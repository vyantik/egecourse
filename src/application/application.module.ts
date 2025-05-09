import { Module } from '@nestjs/common'

import { UserModule } from '@/core/user/user.module'
import { CourseService } from '@/information/course/course.service'

import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'

@Module({
	imports: [UserModule],
	controllers: [ApplicationController],
	providers: [ApplicationService, CourseService],
	exports: [ApplicationService],
})
export class ApplicationModule {}
