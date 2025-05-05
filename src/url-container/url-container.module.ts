import { Module } from '@nestjs/common'

import { UrlContainerController } from './url-container.controller'
import { UrlContainerService } from './url-container.service'

@Module({
	controllers: [UrlContainerController],
	providers: [UrlContainerService],
	exports: [UrlContainerService],
})
export class UrlContainerModule {}
