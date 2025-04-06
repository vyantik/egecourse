import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'

import { FileSystemController } from './file-system.controller'
import { FileSystemService } from './file-system.service'

@Module({
	imports: [
		ConfigModule,
		MulterModule.register({
			limits: {
				fileSize: 5 * 1024 * 1024,
			},
		}),
	],
	controllers: [FileSystemController],
	providers: [FileSystemService],
	exports: [FileSystemService],
})
export class FileSystemModule {}
