import { forwardRef, Module } from '@nestjs/common'

import { AuthModule } from '@/core/auth/auth.module'
import { FileSystemService } from '@/file-system/file-system.service'

import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	imports: [forwardRef(() => AuthModule)],
	controllers: [UserController],
	providers: [UserService, FileSystemService],
	exports: [UserService],
})
export class UserModule {}
