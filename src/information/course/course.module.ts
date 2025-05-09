import { Module } from '@nestjs/common'

import { UserModule } from '@/core/user/user.module'
import { FileSystemModule } from '@/file-system/file-system.module'

import { CourseController } from './course.controller'
import { CourseService } from './course.service'

@Module({
	imports: [UserModule, FileSystemModule],
	controllers: [CourseController],
	providers: [CourseService],
	exports: [CourseService],
})
export class CourseModule {}
