import { Controller, Delete, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__'

import { Authorization } from '@/core/auth/decorators/auth.decorator'

import { FileSystemService } from './file-system.service'

@ApiTags('Файловая система')
@Controller('files')
export class FileSystemController {
	constructor(private readonly fileService: FileSystemService) {}

	@ApiOperation({
		summary: 'Удалить аватар пользователя (только для администратора)',
	})
	@ApiParam({
		name: 'userId',
		description: 'ID пользователя',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiResponse({
		status: 200,
		description: 'Аватар пользователя успешно удален',
	})
	@Delete('avatar/user/:userId')
	@Authorization(UserRole.ADMIN)
	async removeUserAvatar(@Param('userId') userId: string) {
		await this.fileService.removeUserAvatar(userId)
		return { message: 'Аватар успешно удален' }
	}
}
