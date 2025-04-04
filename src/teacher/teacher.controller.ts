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

import { TeacherPaginationResponseDto } from './dto/teacher-pagination-response.dto'
import { TeacherTransferDto } from './dto/teacher-transfer.dto'
import { TeacherDto } from './dto/teacher.dto'
import {
	UpdateFullTeacherDto,
	UpdateTeacherDto,
} from './dto/update-teacher.dto'
import { TeacherService } from './teacher.service'

@ApiTags('teachers')
@Controller('teachers')
export class TeacherController {
	constructor(private readonly teacherService: TeacherService) {}

	@ApiOperation({ summary: 'Create a new teacher' })
	@ApiResponse({
		status: 201,
		description: 'Teacher successfully created',
		type: TeacherTransferDto,
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

	@ApiOperation({ summary: 'Get teacher by ID' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Teacher ID',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiResponse({
		status: 200,
		description: 'Returns the teacher with the specified ID',
		type: TeacherTransferDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Teacher not found',
	})
	@Get(':id')
	async getTeacherById(@Param('id') id: string) {
		return this.teacherService.getTeacherById(id)
	}

	@ApiOperation({
		summary: 'Update part of a teacher (picture cannot be modified)',
	})
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Teacher ID',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiBody({ type: UpdateTeacherDto })
	@ApiResponse({
		status: 200,
		description: 'Teacher successfully updated',
		type: TeacherTransferDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Teacher not found',
	})
	@ApiResponse({
		status: 400,
		description: 'Bad request - validation error',
	})
	@Authorization(UserRole.ADMIN)
	@Patch(':id')
	async updateTeacher(
		@Param('id') id: string,
		@Body() dto: UpdateTeacherDto,
	) {
		return this.teacherService.updateTeacher(id, dto)
	}

	@ApiOperation({
		summary: 'Replace an entire teacher (picture will be preserved)',
	})
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Teacher ID',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiBody({ type: UpdateFullTeacherDto })
	@ApiResponse({
		status: 200,
		description: 'Teacher successfully replaced',
		type: TeacherTransferDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Teacher not found',
	})
	@ApiResponse({
		status: 400,
		description: 'Bad request - validation error',
	})
	@Authorization(UserRole.ADMIN)
	@Put(':id')
	async replaceTeacher(
		@Param('id') id: string,
		@Body() dto: UpdateFullTeacherDto,
	) {
		return this.teacherService.replaceTeacher(id, dto)
	}
}
