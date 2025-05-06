import { Body, Controller, Param, Patch, Post, Put } from '@nestjs/common'
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__/client'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { CourseTransferDto } from '@/course/dto/course-transfer.dto'
import { CourseDto } from '@/course/dto/course.dto'
import { UpdateCourseDto } from '@/course/dto/update-course.dto'

import { AdminService } from './admin.service'

@ApiTags('Админка - Курсы')
@Controller('admin/courses')
export class AdminCourseController {
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
	@Post()
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
	@Patch(':id')
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
	@Put(':id')
	public async replaceCourse(
		@Param('id') id: string,
		@Body() dto: CourseDto,
	) {
		return this.adminService.replaceCourse(id, dto)
	}
}
