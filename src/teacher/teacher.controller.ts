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

@ApiTags('Teachers')
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
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				name: { type: 'string', example: 'John' },
				surname: { type: 'string', example: 'Doe' },
				patronymic: { type: 'string', example: 'Smith' },
				experience: { type: 'string', example: '10 years' },
				egeScore: { type: 'number', example: 95 },
				direction: { type: 'string', example: 'Mathematics' },
				file: {
					type: 'string',
					format: 'binary',
					description: 'Teacher picture file (JPG, PNG, WebP)',
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
	public async getTeachers(
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
	public async getTeacherById(@Param('id') id: string) {
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
	public async updateTeacher(
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
	@ApiBody({ type: UpdateTeacherDto })
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
	public async replaceTeacher(
		@Param('id') id: string,
		@Body() dto: UpdateTeacherDto,
	) {
		return this.teacherService.replaceTeacher(id, dto)
	}

	@ApiOperation({ summary: 'Update teacher picture' })
	@ApiParam({
		name: 'teacherId',
		required: true,
		description: 'Teacher ID',
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
					description: 'New teacher picture file (JPG, PNG, WebP)',
				},
			},
			required: ['file'],
		},
	})
	@ApiResponse({
		status: 200,
		description: 'Teacher picture successfully updated',
		type: TeacherTransferDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Teacher or picture not found',
	})
	@ApiResponse({
		status: 400,
		description: 'Bad request - invalid file format or size',
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

	@ApiOperation({ summary: 'Get teacher picture' })
	@ApiParam({
		name: 'teacherId',
		required: true,
		description: 'Teacher ID',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiParam({
		name: 'picture',
		required: true,
		description: 'Picture filename',
		example: 'teacher-id-uuid.webp',
	})
	@ApiResponse({
		status: 200,
		description: 'Returns the teacher picture',
	})
	@ApiResponse({
		status: 404,
		description: 'Picture or Teacher not found',
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

	@ApiOperation({ summary: 'Delete teacher picture' })
	@ApiParam({
		name: 'teacherId',
		required: true,
		description: 'Teacher ID',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiParam({
		name: 'picture',
		required: true,
		description: 'Picture filename',
		example: 'teacher-id-uuid.webp',
	})
	@ApiResponse({
		status: 200,
		description: 'Picture successfully deleted',
	})
	@ApiResponse({
		status: 404,
		description: 'Picture or Teacher not found',
	})
	@Authorization(UserRole.ADMIN)
	@Delete('/:teacherId/picture/:picture')
	public async deleteTeacherPicture(
		@Param('teacherId') teacherId: string,
		@Param('picture') picture: string,
	) {
		return this.teacherService.deleteTeacherPicture(teacherId, picture)
	}

	@ApiOperation({ summary: 'Delete teacher' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Teacher ID',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@ApiResponse({
		status: 200,
		description: 'Teacher successfully deleted',
	})
	@ApiResponse({
		status: 404,
		description: 'Teacher not found',
	})
	@Authorization(UserRole.ADMIN)
	@Delete(':id')
	public async deleteTeacher(@Param('id') id: string) {
		return this.teacherService.deleteTeacher(id)
	}
}
