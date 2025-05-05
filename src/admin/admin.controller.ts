import {
	Body,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
	ParseFilePipe,
	Patch,
	Post,
	Put,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__/client'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { parseFileConfig } from '@/config/parse-file.config'
import { CourseTransferDto } from '@/course/dto/course-transfer.dto'
import { CourseDto } from '@/course/dto/course.dto'
import { UpdateCourseDto } from '@/course/dto/update-course.dto'
import { FaqTransferDto } from '@/faq/dto/faq-transfer.dto'
import { FaqDto } from '@/faq/dto/faq.dto'
import { UpdateFaqDto, UpdateFullFaqDto } from '@/faq/dto/update-faq.dto'
import { TransformTeacherDtoPipe } from '@/libs/common/pipes/transform-teacher-dto.pipe'
import { TeacherTransferDto } from '@/teacher/dto/teacher-transfer.dto'
import { CreateTeacherDto } from '@/teacher/dto/teacher.dto'
import { UpdateTeacherDto } from '@/teacher/dto/update-teacher.dto'
import {
	CreateUrlContainerDto,
	UpdateUrlContainerDto,
} from '@/url-container/dto/url-container.dto'
import { CreateWebinarDto } from '@/webinar/dto/create-webinar.dto'
import { Webinar } from '@/webinar/entities/webinar.entity'

import { AdminService } from './admin.service'

@ApiTags('Админка')
@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@ApiOperation({ summary: 'Создать новый курс' })
	@ApiBody({ type: CourseDto })
	@ApiResponse({
		status: 201,
		description: 'Курс успешно создан',
		type: CourseTransferDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Неверный запрос - ошибка валидации',
	})
	@Authorization(UserRole.ADMIN)
	@Post('courses')
	public async createCourse(@Body() dto: CourseDto) {
		return this.adminService.createCourse(dto)
	}

	@ApiOperation({ summary: 'Частично обновить курс' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'ID курса',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiBody({ type: UpdateCourseDto })
	@ApiResponse({
		status: 200,
		description: 'Курс успешно обновлен',
		type: CourseTransferDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Курс не найден',
	})
	@ApiResponse({
		status: 400,
		description: 'Неверный запрос - ошибка валидации',
	})
	@Authorization(UserRole.ADMIN)
	@Patch('courses/:id')
	public async updateCourse(
		@Param('id') id: string,
		@Body() dto: UpdateCourseDto,
	) {
		return this.adminService.updateCourse(id, dto)
	}

	@ApiOperation({ summary: 'Полностью заменить курс' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'ID курса',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiBody({ type: CourseDto })
	@ApiResponse({
		status: 200,
		description: 'Курс успешно заменен',
		type: CourseTransferDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Курс не найден',
	})
	@ApiResponse({
		status: 400,
		description: 'Неверный запрос - ошибка валидации',
	})
	@Authorization(UserRole.ADMIN)
	@Put('courses/:id')
	public async replaceCourse(
		@Param('id') id: string,
		@Body() dto: CourseDto,
	) {
		return this.adminService.replaceCourse(id, dto)
	}

	@ApiOperation({ summary: 'Создать новый FAQ' })
	@ApiResponse({
		status: 201,
		description: 'FAQ успешно создан',
		type: FaqDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Неверный запрос - ошибка валидации',
	})
	@Authorization(UserRole.ADMIN)
	@Post('faq')
	public async createFaq(@Body() dto: FaqDto) {
		return this.adminService.createFaq(dto)
	}

	@ApiOperation({ summary: 'Частично обновить FAQ' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'ID FAQ',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiBody({ type: UpdateFaqDto })
	@ApiResponse({
		status: 200,
		description: 'FAQ успешно обновлен',
		type: FaqTransferDto,
	})
	@ApiResponse({
		status: 404,
		description: 'FAQ не найден',
	})
	@ApiResponse({
		status: 400,
		description: 'Неверный запрос - ошибка валидации',
	})
	@Authorization(UserRole.ADMIN)
	@Patch('faq/:id')
	public async updateFaq(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
		return this.adminService.updateFaq(id, dto)
	}

	@ApiOperation({ summary: 'Полностью заменить FAQ' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'ID FAQ',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiBody({ type: UpdateFullFaqDto })
	@ApiResponse({
		status: 200,
		description: 'FAQ успешно заменен',
		type: FaqTransferDto,
	})
	@ApiResponse({
		status: 404,
		description: 'FAQ не найден',
	})
	@ApiResponse({
		status: 400,
		description: 'Неверный запрос - ошибка валидации',
	})
	@Authorization(UserRole.ADMIN)
	@Put('faq/:id')
	public async replaceFaq(
		@Param('id') id: string,
		@Body() dto: UpdateFullFaqDto,
	) {
		return this.adminService.replaceFaq(id, dto)
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
	@Patch('teachers/:id')
	public async updateTeacher(
		@Param('id') id: string,
		@Body() dto: UpdateTeacherDto,
	) {
		return this.adminService.updateTeacher(id, dto)
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
	@Put('teachers/:id')
	public async replaceTeacher(
		@Param('id') id: string,
		@Body() dto: UpdateTeacherDto,
	) {
		return this.adminService.replaceTeacher(id, dto)
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
	@Patch('teachers/:teacherId/picture')
	public async updateTeacherPicture(
		@Param('teacherId') teacherId: string,
		@UploadedFile(new ParseFilePipe(parseFileConfig))
		file: Express.Multer.File,
	) {
		return this.adminService.updateTeacherPicture(teacherId, file)
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
	@Delete('teachers/:teacherId/picture/:picture')
	public async deleteTeacherPicture(
		@Param('teacherId') teacherId: string,
		@Param('picture') picture: string,
	) {
		return this.adminService.deleteTeacherPicture(teacherId, picture)
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
	@Delete('teachers/:id')
	public async deleteTeacher(@Param('id') id: string) {
		return this.adminService.deleteTeacher(id)
	}

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
	@Post('teachers')
	public async createTeacher(
		@Body(new TransformTeacherDtoPipe()) dto: CreateTeacherDto,
		@UploadedFile(
			new ParseFilePipe({ ...parseFileConfig, fileIsRequired: false }),
		)
		file?: Express.Multer.File,
	) {
		return this.adminService.createTeacher(dto, file)
	}

	@ApiOperation({ summary: 'Создать URL', description: 'Создать новый URL' })
	@ApiBody({
		type: CreateUrlContainerDto,
		description: 'Данные для создания URL',
		examples: {
			example1: {
				value: {
					key: 'test',
					url: 'https://example.com',
				},
			},
		},
	})
	@ApiResponse({ status: 201, description: 'URL успешно создан' })
	@ApiResponse({
		status: 400,
		description: 'Неверные данные для создания URL',
	})
	@ApiResponse({ status: 403, description: 'Доступ запрещен' })
	@Post('urls')
	@Authorization(UserRole.ADMIN)
	public async createUrlContainer(@Body() dto: CreateUrlContainerDto) {
		return this.adminService.createUrlContainer(dto)
	}

	@ApiOperation({
		summary: 'Обновить URL',
		description: 'Обновить существующий URL',
	})
	@ApiParam({
		name: 'key',
		description: 'Ключ для обновления URL',
		type: String,
	})
	@ApiBody({
		type: UpdateUrlContainerDto,
		description: 'Данные для обновления URL',
		examples: {
			example1: {
				value: {
					url: 'https://example.com',
				},
			},
		},
	})
	@ApiResponse({ status: 200, description: 'URL успешно обновлен' })
	@ApiResponse({ status: 404, description: 'URL не найден' })
	@ApiResponse({ status: 403, description: 'Доступ запрещен' })
	@ApiResponse({
		status: 400,
		description: 'Неверные данные для обновления URL',
	})
	@Patch('urls/:key')
	@Authorization(UserRole.ADMIN)
	public async updateUrlContainer(
		@Param('key') key: string,
		@Body() dto: UpdateUrlContainerDto,
	) {
		return this.adminService.updateUrlContainer(key, dto)
	}

	@ApiOperation({ summary: 'Создать вебинар' })
	@ApiBody({ type: CreateWebinarDto })
	@ApiResponse({
		status: 201,
		description: 'Вебинар успешно создан',
		type: Webinar,
	})
	@ApiResponse({
		status: 400,
		description: 'Некорректные данные',
	})
	@Authorization(UserRole.ADMIN)
	@HttpCode(HttpStatus.CREATED)
	@Post('webinars')
	async createWebinar(@Body() dto: CreateWebinarDto) {
		return this.adminService.createWebinar(dto)
	}
}
