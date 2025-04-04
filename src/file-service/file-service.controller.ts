import {
	Body,
	Controller,
	Delete,
	FileTypeValidator,
	Get,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	Post,
	Res,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__'
import { Response } from 'express'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'

import { FileServiceService } from './file-service.service'

@ApiTags('files')
@Controller('files')
export class FileServiceController {
	constructor(private readonly fileService: FileServiceService) {}

	@ApiOperation({ summary: 'Upload user avatar' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
					description: 'Avatar image file (JPG, PNG, WebP)',
				},
			},
		},
	})
	@ApiResponse({
		status: 201,
		description: 'Avatar uploaded successfully',
		schema: {
			type: 'object',
			properties: {
				url: {
					type: 'string',
					example: 'http://example.com/avatars/user-id-uuid.webp',
				},
			},
		},
	})
	@Post('avatar')
	@Authorization()
	@UseInterceptors(FileInterceptor('file'))
	async uploadAvatar(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
					new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
				],
			}),
		)
		file: Express.Multer.File,
		@Authorized('id') userId: string,
	) {
		const url = await this.fileService.uploadAvatar(file, userId)
		return { url }
	}

	@ApiOperation({ summary: 'Upload teacher picture' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
					description: 'Teacher picture file (JPG, PNG, WebP)',
				},
				teacherId: {
					type: 'string',
					description: 'ID of the teacher',
					example: '550e8400-e29b-41d4-a716-446655440000',
				},
			},
		},
	})
	@ApiResponse({
		status: 201,
		description: 'Teacher picture uploaded successfully',
		schema: {
			type: 'object',
			properties: {
				url: {
					type: 'string',
					example:
						'http://example.com/teacher-pictures/teacher-id-uuid.webp',
				},
			},
		},
	})
	@Post('teacherPicture')
	@Authorization(UserRole.ADMIN)
	@UseInterceptors(FileInterceptor('file'))
	async uploadTeacherPicture(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
					new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
				],
			}),
		)
		file: Express.Multer.File,
		@Body('teacherId') teacherId: string,
	) {
		const url = await this.fileService.uploadTeacherPicture(file, teacherId)
		return { url }
	}

	@ApiOperation({ summary: 'Get avatar by filename' })
	@ApiParam({
		name: 'filename',
		description: 'Avatar filename',
		example: 'user-id-uuid.webp',
	})
	@ApiResponse({ status: 200, description: 'Returns the avatar image' })
	@ApiResponse({ status: 404, description: 'Avatar not found' })
	@Get('avatar/:filename')
	async getAvatar(@Param('filename') filename: string, @Res() res: Response) {
		const file = await this.fileService.getAvatar(filename)

		const extension = filename.split('.').pop().toLowerCase()
		const mimeTypes = {
			jpg: 'image/jpeg',
			jpeg: 'image/jpeg',
			png: 'image/png',
			webp: 'image/webp',
		}

		res.setHeader('Content-Type', mimeTypes[extension] || 'image/webp')
		res.setHeader('Cache-Control', 'max-age=31536000')
		return res.send(file)
	}

	@ApiOperation({ summary: 'Get teacher picture by filename' })
	@ApiParam({
		name: 'filename',
		description: 'Teacher filename',
		example: 'teacher-id-uuid.webp',
	})
	@ApiResponse({ status: 200, description: 'Returns the teacher picture' })
	@ApiResponse({ status: 404, description: 'Teacher not found' })
	@Get('teacher-picture/:filename')
	async getTeacherPicture(
		@Param('filename') filename: string,
		@Res() res: Response,
	) {
		const file = await this.fileService.getTeacherPicture(filename)

		const extension = filename.split('.').pop().toLowerCase()
		const mimeTypes = {
			jpg: 'image/jpeg',
			jpeg: 'image/jpeg',
			png: 'image/png',
			webp: 'image/webp',
		}

		res.setHeader('Content-Type', mimeTypes[extension] || 'image/webp')
		res.setHeader('Cache-Control', 'max-age=31536000')
		return res.send(file)
	}

	@ApiOperation({ summary: 'Remove current user avatar' })
	@ApiResponse({ status: 200, description: 'Avatar removed successfully' })
	@Delete('avatar')
	@Authorization()
	async removeAvatar(@Authorized('id') userId: string) {
		await this.fileService.removeUserAvatar(userId)
		return { message: 'success' }
	}

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
