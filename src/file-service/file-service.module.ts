import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'

import { FileServiceController } from './file-service.controller'
import { FileServiceService } from './file-service.service'

@Module({
	imports: [
		ConfigModule,
		MulterModule.register({
			limits: {
				fileSize: 5 * 1024 * 1024,
			},
		}),
	],
	controllers: [FileServiceController],
	providers: [FileServiceService],
	exports: [FileServiceService],
})
export class FileServiceModule {}
