import { Module } from '@nestjs/common'

import { FileSystemModule } from '@/file-system/file-system.module'

import { TeacherController } from './teacher.controller'
import { TeacherService } from './teacher.service'

@Module({
	imports: [FileSystemModule],
	controllers: [TeacherController],
	providers: [TeacherService],
	exports: [TeacherService],
})
export class TeacherModule {}
