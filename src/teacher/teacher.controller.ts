import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseFilePipe,
	Patch,
	Post,
	Put,
	Query,
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
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__'
import { Response } from 'express'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { parseFileConfig } from '@/config/parse-file.config'
import { TransformTeacherDtoPipe } from '@/libs/common/pipes/transform-teacher-dto.pipe'

import { TeacherPaginationResponseDto } from './dto/teacher-pagination-response.dto'
import { TeacherTransferDto } from './dto/teacher-transfer.dto'
import { CreateTeacherDto } from './dto/teacher.dto'
import { UpdateTeacherDto } from './dto/update-teacher.dto'
import { TeacherService } from './teacher.service'

@ApiTags('Преподаватели')
@Controller('teachers')
export class TeacherController {
	constructor(private readonly teacherService: TeacherService) {}

	@ApiOperation({ summary: 'Создать нового преподавателя' })
	@ApiResponse({
		status: 201,
		description: 'Преподаватель успешно создан',
		type: TeacherTransferDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Неверный запрос - ошибка валидации',
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				name: { type: 'string', example: 'Иван' },
				surname: { type: 'string', example: 'Иванов' },
				patronymic: { type: 'string', example: 'Иванович' },
				experience: { type: 'string', example: '10 лет' },
				egeScore: { type: 'number', example: 95 },
				direction: { type: 'string', example: 'Математика' },
				file: {
					type: 'string',
					format: 'binary',
					description: 'Фотография преподавателя (JPG, PNG, WebP)',
				},
			},
			required: [
				'name',
				'surname',
				'patronymic',
				'experience',
				'egeScore',
				'direction',
			],
		},
	})
	@Authorization(UserRole.ADMIN)
	@UseInterceptors(FileInterceptor('file'))
	@Post()
	public async createTeacher(
		@Body(new TransformTeacherDtoPipe()) dto: CreateTeacherDto,
		@UploadedFile(
			new ParseFilePipe({ ...parseFileConfig, fileIsRequired: false }),
		)
		file?: Express.Multer.File,
	) {
		return this.teacherService.createTeacher(dto, file)
	}

	@ApiOperation({ summary: 'Получить всех преподавателей с пагинацией' })
	@ApiQuery({
		name: 'page',
		required: false,
		type: Number,
		description: 'Номер страницы (начиная с 1)',
		example: 1,
	})
	@ApiQuery({
		name: 'limit',
		required: false,
		type: Number,
		description: 'Количество элементов на странице',
		example: 10,
	})
	@ApiResponse({
		status: 200,
		description: 'Возвращает преподавателей с метаданными пагинации',
		type: TeacherPaginationResponseDto,
	})
	@Get()
	public async getTeachers(
		@Query('page') page?: number,
		@Query('limit') limit?: number,
	) {
		return this.teacherService.getTeachers(page, limit)
	}

	@ApiOperation({ summary: 'Получить преподавателя по ID' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'ID преподавателя',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiResponse({
		status: 200,
		description: 'Возвращает преподавателя с указанным ID',
		type: TeacherTransferDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Преподаватель не найден',
	})
	@Get(':id')
	public async getTeacherById(@Param('id') id: string) {
		return this.teacherService.getTeacherById(id)
	}

	@ApiOperation({
		summary:
			'Частично обновить данные преподавателя (фотография не может быть изменена)',
	})
	@ApiParam({
		name: 'id',
		required: true,
		description: 'ID преподавателя',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiBody({ type: UpdateTeacherDto })
	@ApiResponse({
		status: 200,
		description: 'Преподаватель успешно обновлен',
		type: TeacherTransferDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Преподаватель не найден',
	})
	@ApiResponse({
		status: 400,
		description: 'Неверный запрос - ошибка валидации',
	})
	@Authorization(UserRole.ADMIN)
	@Patch(':id')
	public async updateTeacher(
		@Param('id') id: string,
		@Body() dto: UpdateTeacherDto,
	) {
		return this.teacherService.updateTeacher(id, dto)
	}

	@ApiOperation({
		summary:
			'Полностью заменить данные преподавателя (фотография будет сохранена)',
	})
	@ApiParam({
		name: 'id',
		required: true,
		description: 'ID преподавателя',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiBody({ type: UpdateTeacherDto })
	@ApiResponse({
		status: 200,
		description: 'Данные преподавателя успешно заменены',
		type: TeacherTransferDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Преподаватель не найден',
	})
	@ApiResponse({
		status: 400,
		description: 'Неверный запрос - ошибка валидации',
	})
	@Authorization(UserRole.ADMIN)
	@Put(':id')
	public async replaceTeacher(
		@Param('id') id: string,
		@Body() dto: UpdateTeacherDto,
	) {
		return this.teacherService.replaceTeacher(id, dto)
	}

	@ApiOperation({ summary: 'Обновить фотографию преподавателя' })
	@ApiParam({
		name: 'teacherId',
		required: true,
		description: 'ID преподавателя',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
					description:
						'Новая фотография преподавателя (JPG, PNG, WebP)',
				},
			},
			required: ['file'],
		},
	})
	@ApiResponse({
		status: 200,
		description: 'Фотография преподавателя успешно обновлена',
		type: TeacherTransferDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Преподаватель или фотография не найдены',
	})
	@ApiResponse({
		status: 400,
		description: 'Неверный запрос - неверный формат или размер файла',
	})
	@Authorization(UserRole.ADMIN)
	@UseInterceptors(FileInterceptor('file'))
	@Patch('/:teacherId/picture')
	public async updateTeacherPicture(
		@Param('teacherId') teacherId: string,
		@UploadedFile(new ParseFilePipe(parseFileConfig))
		file: Express.Multer.File,
	) {
		return this.teacherService.updateTeacherPicture(teacherId, file)
	}

	@ApiOperation({ summary: 'Получить фотографию преподавателя' })
	@ApiParam({
		name: 'teacherId',
		required: true,
		description: 'ID преподавателя',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiParam({
		name: 'picture',
		required: true,
		description: 'Имя файла фотографии',
		example: 'teacher-photo.jpg',
	})
	@ApiResponse({
		status: 200,
		description: 'Возвращает фотографию преподавателя',
	})
	@ApiResponse({
		status: 404,
		description: 'Преподаватель или фотография не найдены',
	})
	@Get('/:teacherId/picture/:picture')
	public async getPicture(
		@Param('teacherId') teacherId: string,
		@Param('picture') picture: string,
		@Res() res: Response,
	) {
		const file = await this.teacherService.getPicture(teacherId, picture)

		const extension = picture.split('.').pop().toLowerCase()
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

	@ApiOperation({ summary: 'Удалить фотографию преподавателя' })
	@ApiParam({
		name: 'teacherId',
		required: true,
		description: 'ID преподавателя',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiParam({
		name: 'picture',
		required: true,
		description: 'Имя файла фотографии',
		example: 'teacher-photo.jpg',
	})
	@ApiResponse({
		status: 200,
		description: 'Фотография преподавателя успешно удалена',
	})
	@ApiResponse({
		status: 404,
		description: 'Преподаватель или фотография не найдены',
	})
	@Authorization(UserRole.ADMIN)
	@Delete('/:teacherId/picture/:picture')
	public async deleteTeacherPicture(
		@Param('teacherId') teacherId: string,
		@Param('picture') picture: string,
	) {
		return this.teacherService.deleteTeacherPicture(teacherId, picture)
	}

	@ApiOperation({ summary: 'Удалить преподавателя' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'ID преподавателя',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiResponse({
		status: 200,
		description: 'Преподаватель успешно удален',
	})
	@ApiResponse({
		status: 404,
		description: 'Преподаватель не найден',
	})
	@Authorization(UserRole.ADMIN)
	@Delete(':id')
	public async deleteTeacher(@Param('id') id: string) {
		return this.teacherService.deleteTeacher(id)
	}
}
