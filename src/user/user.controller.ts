import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseFilePipe,
	Patch,
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
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__'
import { Response } from 'express'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'
import { parseFileConfig } from '@/config/parse-file.config'

import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserResponseEntity } from './entities/user-response.entity'
import { UserService } from './user.service'

@ApiTags('Users')
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({ summary: 'Get current user profile' })
	@ApiResponse({
		status: 200,
		description: 'Returns the current user profile',
		type: UserResponseEntity,
	})
	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get('profile')
	public async findProfile(@Authorized('id') userId: string) {
		return this.userService.findById(userId)
	}

	@ApiOperation({ summary: 'Get user by ID (Admin only)' })
	@ApiResponse({
		status: 200,
		description: 'Returns the user with the specified ID',
		type: UserResponseEntity,
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden - Insufficient permissions',
	})
	@ApiResponse({ status: 404, description: 'User not found' })
	@Authorization(UserRole.ADMIN)
	@HttpCode(HttpStatus.OK)
	@Get('/by-id/:id')
	public async findById(@Param('id') id: string) {
		return this.userService.findById(id)
	}

	@ApiOperation({ summary: 'Update current user profile' })
	@ApiResponse({
		status: 200,
		description: 'User profile updated successfully',
		type: UserResponseEntity,
	})
	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Patch('profile')
	public async updateProfile(
		@Authorized('id') userId: string,
		@Body() dto: UpdateUserDto,
	) {
		return this.userService.update(userId, dto)
	}

	@ApiOperation({ summary: 'Update user avatar' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
					description: 'New user picture file (JPG, PNG, WebP)',
				},
			},
			required: ['file'],
		},
	})
	@ApiResponse({
		status: 200,
		description: 'User avatar updated successfully',
		type: UserResponseEntity,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad request - invalid file format or size',
	})
	@ApiResponse({
		status: 404,
		description: 'User not found',
	})
	@Authorization()
	@UseInterceptors(FileInterceptor('file'))
	@Patch('/profile/picture')
	public async updateUserPicture(
		@Authorized('id') userId: string,
		@UploadedFile(new ParseFilePipe(parseFileConfig))
		file: Express.Multer.File,
	) {
		return this.userService.updateAvatar(userId, file)
	}

	@ApiOperation({ summary: 'Get user avatar image' })
	@ApiResponse({
		status: 200,
		description: 'Returns the user avatar image',
	})
	@ApiResponse({
		status: 404,
		description: 'User or avatar not found',
	})
	@Get('/:userId/picture/:picture')
	public async getPicture(
		@Param('userId') userId: string,
		@Param('picture') picture: string,
		@Res() res: Response,
	) {
		const file = await this.userService.getAvatar(userId, picture)

		const extension = picture.split('.').pop().toLowerCase()
		const mimeTypes = {
			jpg: 'image/jpeg',
			jpeg: 'image/jpeg',
			png: 'image/png',
			webp: 'image/webp',
		}

		res.setHeader('Content-Type', mimeTypes[extension] || 'image/webp')

		return res.send(file)
	}

	@ApiOperation({ summary: 'Create a new review' })
	@ApiResponse({
		status: 201,
		description: 'Review created successfully',
	})
	@ApiResponse({
		status: 404,
		description: 'User not found',
	})
	@Authorization()
	@HttpCode(HttpStatus.CREATED)
	@Post('/profile/review')
	public async createReview(
		@Authorized('id') userId: string,
		@Body() dto: CreateReviewDto,
	) {
		return this.userService.createReview(userId, dto.text)
	}
}
