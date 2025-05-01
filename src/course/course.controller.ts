import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Put,
	Query,
} from '@nestjs/common'
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__'

import { Authorization } from '@/auth/decorators/auth.decorator'

import { CourseService } from './course.service'
import { CoursePaginationResponseDto } from './dto/course-pagination-response.dto'
import { CourseTransferDto } from './dto/course-transfer.dto'
import { CourseDto } from './dto/course.dto'
import { UpdateCourseDto } from './dto/update-course.dto'

@ApiTags('Курсы')
@Controller('courses')
export class CourseController {
	constructor(private readonly courseService: CourseService) {}

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
	@Post()
	public async createCourse(@Body() dto: CourseDto) {
		return this.courseService.createCourse(dto)
	}

	@ApiOperation({ summary: 'Получить все курсы с пагинацией' })
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
		description: 'Возвращает курсы с метаданными пагинации',
		type: CoursePaginationResponseDto,
	})
	@Get()
	public async getCourses(
		@Query('page') page?: number,
		@Query('limit') limit?: number,
	) {
		return this.courseService.getCourses(page, limit)
	}

	@ApiOperation({ summary: 'Получить курс по ID' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'ID курса',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiResponse({
		status: 200,
		description: 'Возвращает курс с указанным ID',
		type: CourseTransferDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Курс не найден',
	})
	@Get(':id')
	public async getCourseById(@Param('id') id: string) {
		return this.courseService.getCourseById(id)
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
	@Patch(':id')
	public async updateCourse(
		@Param('id') id: string,
		@Body() dto: UpdateCourseDto,
	) {
		return this.courseService.updateCourse(id, dto)
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
	@Put(':id')
	public async replaceCourse(
		@Param('id') id: string,
		@Body() dto: CourseDto,
	) {
		return this.courseService.replaceCourse(id, dto)
	}
}
