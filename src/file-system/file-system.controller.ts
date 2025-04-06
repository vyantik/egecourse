import { Controller, Delete, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__'

import { Authorization } from '@/auth/decorators/auth.decorator'

import { FileSystemService } from './file-system.service'

@ApiTags('File System')
@Controller('files')
export class FileSystemController {
	constructor(private readonly fileService: FileSystemService) {}

	@ApiOperation({ summary: 'Remove user avatar (Admin only)' })
	@ApiParam({
		name: 'userId',
		description: 'User ID',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiResponse({
		status: 200,
		description: 'User avatar removed successfully',
	})
	@Delete('avatar/user/:userId')
	@Authorization(UserRole.ADMIN)
	async removeUserAvatar(@Param('userId') userId: string) {
		await this.fileService.removeUserAvatar(userId)
		return { message: 'success' }
	}
}
