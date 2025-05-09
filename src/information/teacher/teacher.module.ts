import { Module } from '@nestjs/common'

import { FileSystemService } from '@/file-system/file-system.service'

import { TeacherController } from './teacher.controller'
import { TeacherService } from './teacher.service'

@Module({
	imports: [],
	controllers: [TeacherController],
	providers: [TeacherService, FileSystemService],
	exports: [TeacherService],
})
export class TeacherModule {}
