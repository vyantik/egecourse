import { Controller, Get, Param, Query, Res } from '@nestjs/common'
import {
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { Response } from 'express'

import { TeacherPaginationResponseDto } from './dto/teacher-pagination-response.dto'
import { TeacherTransferDto } from './dto/teacher-transfer.dto'
import { TeacherService } from './teacher.service'

@ApiTags('Преподаватели')
@Controller('teachers')
export class TeacherController {
	constructor(private readonly teacherService: TeacherService) {}

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
		res.setHeader('Cache-Control', 'max-age=600')

		return res.send(file)
	}
}
