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

import { parseFileConfig } from '@/config/parse-file.config'
import { Authorization } from '@/core/auth/decorators/auth.decorator'
import { Authorized } from '@/core/auth/decorators/authorized.decorator'

import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserResponseEntity } from './entities/user-response.entity'
import { UserService } from './user.service'

@ApiTags('Пользователи')
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({ summary: 'Получить профиль текущего пользователя' })
	@ApiResponse({
		status: 200,
		description: 'Возвращает профиль текущего пользователя',
		type: UserResponseEntity,
	})
	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get('profile')
	public async findProfile(@Authorized('id') userId: string) {
		return this.userService.findById(userId)
	}

	@ApiOperation({
		summary: 'Получить пользователя по ID (только для администраторов)',
	})
	@ApiResponse({
		status: 200,
		description: 'Возвращает пользователя с указанным ID',
		type: UserResponseEntity,
	})
	@ApiResponse({
		status: 403,
		description: 'Запрещено - Недостаточно прав',
	})
	@ApiResponse({ status: 404, description: 'Пользователь не найден' })
	@Authorization(UserRole.ADMIN)
	@HttpCode(HttpStatus.OK)
	@Get('/by-id/:id')
	public async findById(@Param('id') id: string) {
		return this.userService.findById(id)
	}

	@ApiOperation({ summary: 'Обновить профиль текущего пользователя' })
	@ApiResponse({
		status: 200,
		description: 'Профиль пользователя успешно обновлен',
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

	@ApiOperation({ summary: 'Обновить аватар пользователя' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
					description:
						'Новый файл изображения пользователя (JPG, PNG, WebP)',
				},
			},
			required: ['file'],
		},
	})
	@ApiResponse({
		status: 200,
		description: 'Аватар пользователя успешно обновлен',
		type: UserResponseEntity,
	})
	@ApiResponse({
		status: 400,
		description: 'Неверный запрос - неверный формат или размер файла',
	})
	@ApiResponse({
		status: 404,
		description: 'Пользователь не найден',
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

	@ApiOperation({ summary: 'Получить изображение аватара пользователя' })
	@ApiResponse({
		status: 200,
		description: 'Возвращает изображение аватара пользователя',
	})
	@ApiResponse({
		status: 404,
		description: 'Пользователь или аватар не найден',
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

	@ApiOperation({ summary: 'Создать новый отзыв' })
	@ApiResponse({
		status: 201,
		description: 'Отзыв успешно создан',
	})
	@ApiResponse({
		status: 404,
		description: 'Пользователь не найден или курс не найден',
	})
	@ApiResponse({
		status: 400,
		description: 'Некорректные данные',
	})
	@ApiBody({ type: CreateReviewDto })
	@Authorization()
	@HttpCode(HttpStatus.CREATED)
	@Post('/profile/review')
	public async createReview(
		@Authorized('id') userId: string,
		@Body() dto: CreateReviewDto,
	) {
		return this.userService.createReview(userId, dto)
	}
}
