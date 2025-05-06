import { Controller, Get, Param, Query } from '@nestjs/common'
import {
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'

import { CourseService } from './course.service'
import { CourseTransferDto } from './dto/course-transfer.dto'
import { CourseResponseEntity } from './entities/course-response.entity'

@ApiTags('Курсы')
@Controller('courses')
export class CourseController {
	constructor(private readonly courseService: CourseService) {}
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
		type: CourseResponseEntity,
		isArray: true,
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
}
