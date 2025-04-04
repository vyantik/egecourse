import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
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

@ApiTags('courses')
@Controller('courses')
export class CourseController {
	constructor(private readonly courseService: CourseService) {}

	@ApiOperation({ summary: 'Create a new course' })
	@ApiBody({ type: CourseDto })
	@ApiResponse({
		status: 201,
		description: 'Course successfully created',
		type: CourseTransferDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad request - validation error',
	})
	@Authorization(UserRole.ADMIN)
	@Post()
	async createCourse(@Body() dto: CourseDto) {
		return this.courseService.createCourse(dto)
	}

	@ApiOperation({ summary: 'Get all courses with pagination' })
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
		description: 'Returns courses with pagination metadata',
		type: CoursePaginationResponseDto,
	})
	@Get()
	async getCourses(
		@Query('page') page?: number,
		@Query('limit') limit?: number,
	) {
		return this.courseService.getCourses(page, limit)
	}

	@ApiOperation({ summary: 'Get course by ID' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Course ID',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiResponse({
		status: 200,
		description: 'Returns the course with the specified ID',
		type: CourseTransferDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Course not found',
	})
	@Get('/by-id/:id')
	async getCourseById(@Param('id') id: string) {
		return this.courseService.getCourseById(id)
	}
}
