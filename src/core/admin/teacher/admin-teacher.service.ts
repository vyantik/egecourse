import { Injectable } from '@nestjs/common'

import { CreateTeacherDto } from '@/information/teacher/dto/teacher.dto'
import { UpdateTeacherDto } from '@/information/teacher/dto/update-teacher.dto'
import { TeacherService } from '@/information/teacher/teacher.service'

@Injectable()
export class AdminTeacherService {
	constructor(private readonly teacherService: TeacherService) {}

	/**
	 * Создает нового преподавателя
	 * @param dto - Данные для создания преподавателя
	 * @param file - Фотография преподавателя (опционально)
	 * @returns Promise с созданным преподавателем
	 */
	public async createTeacher(
		dto: CreateTeacherDto,
		file?: Express.Multer.File,
	) {
		return this.teacherService.createTeacher(dto, file)
	}

	/**
	 * Обновляет данные преподавателя
	 * @param id - ID преподавателя
	 * @param dto - Данные для обновления преподавателя
	 * @returns Promise с обновленным преподавателем
	 */
	public async updateTeacher(id: string, dto: UpdateTeacherDto) {
		return this.teacherService.updateTeacher(id, dto)
	}

	/**
	 * Заменяет данные преподавателя
	 * @param id - ID преподавателя
	 * @param dto - Данные для замены преподавателя
	 * @returns Promise с замененным преподавателем
	 */
	public async replaceTeacher(id: string, dto: UpdateTeacherDto) {
		return this.teacherService.replaceTeacher(id, dto)
	}

	/**
	 * Обновляет фотографию преподавателя
	 * @param teacherId - ID преподавателя
	 * @param file - Новая фотография преподавателя
	 * @returns Promise с обновленной фотографией преподавателя
	 */
	public async updateTeacherPicture(
		teacherId: string,
		file: Express.Multer.File,
	) {
		return this.teacherService.updateTeacherPicture(teacherId, file)
	}

	/**
	 * Удаляет фотографию преподавателя
	 * @param teacherId - ID преподавателя
	 * @param picture - Имя фотографии
	 * @returns Promise с удаленной фотографией преподавателя
	 */
	public async deleteTeacherPicture(teacherId: string, picture: string) {
		return this.teacherService.deleteTeacherPicture(teacherId, picture)
	}

	/**
	 * Удаляет преподавателя
	 * @param id - ID преподавателя
	 * @returns Promise с удаленным преподавателем
	 */
	public async deleteTeacher(id: string) {
		return this.teacherService.deleteTeacher(id)
	}
}
