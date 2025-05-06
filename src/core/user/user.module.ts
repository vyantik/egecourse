import { forwardRef, Module } from '@nestjs/common'

import { AuthModule } from '@/core/auth/auth.module'
import { FileSystemModule } from '@/file-system/file-system.module'

import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	imports: [forwardRef(() => AuthModule), FileSystemModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
