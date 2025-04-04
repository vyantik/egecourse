import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__'

import { Authorization } from '@/auth/decorators/auth.decorator'

import { TeacherPaginationResponseDto } from './dto/teacher-pagination-response.dto'
import { TeacherDto } from './dto/teacher.dto'
import { TeacherService } from './teacher.service'

@ApiTags('teachers')
@Controller('teachers')
export class TeacherController {
	constructor(private readonly teacherService: TeacherService) {}

	@ApiOperation({ summary: 'Create a new teacher' })
	@ApiResponse({
		status: 201,
		description: 'Teacher successfully created',
		type: TeacherDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad request - validation error',
	})
	@Authorization(UserRole.ADMIN)
	@Post()
	async createTeacher(@Body() dto: TeacherDto) {
		return this.teacherService.createTeacher(dto)
	}

	@ApiOperation({ summary: 'Get all teachers with pagination' })
	@ApiQuery({
		name: 'page',
		required: false,
		type: Number,
		description: 'Page number (starts from 1)',
		example: 1,
	})
	@ApiQuery({
		name: 'limit',
		required: false,
		type: Number,
		description: 'Number of items per page',
		example: 10,
	})
	@ApiResponse({
		status: 200,
		description: 'Returns teachers with pagination metadata',
		type: TeacherPaginationResponseDto,
	})
	@Get()
	async getTeachers(
		@Query('page') page?: number,
		@Query('limit') limit?: number,
	) {
		return this.teacherService.getTeachers(page, limit)
	}
}
