import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Teacher, TeacherCategory } from '@prisma/__generated__'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

import { FileSystemService } from '@/file-system/file-system.service'
import { Meta } from '@/libs/common/utils/meta'
import { PrismaService } from '@/prisma/prisma.service'

import { CreateTeacherDto } from './dto/teacher.dto'
import { UpdateTeacherDto } from './dto/update-teacher.dto'

/**
 * Сервис для управления преподавателями
 * Предоставляет методы для создания, получения, обновления и удаления преподавателей,
 * а также управления их фотографиями
 */
@Injectable()
export class TeacherService {
	/**
	 * Директории для хранения файлов и базовый URL
	 * @private
	 */
	private readonly uploadDir: string
	private readonly teacherPicturesDir: string
	private readonly baseUrl: string

	/**
	 * Конструктор сервиса преподавателей
	 * @param prismaService - Сервис для работы с базой данных
	 * @param configService - Сервис конфигурации
	 * @param fileService - Сервис для работы с файловой системой
	 */
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly fileService: FileSystemService,
	) {
		this.uploadDir =
			this.configService.get<string>('UPLOAD_DIR') || 'uploads'
		this.teacherPicturesDir = join(this.uploadDir, 'teacherPictures')
		this.baseUrl = this.configService.get<string>('APPLICATION_URL')

		if (!existsSync(this.teacherPicturesDir)) {
			mkdirSync(this.teacherPicturesDir, { recursive: true })
		}
	}

	/**
	 * Создает нового преподавателя
	 * @param dto - DTO с данными преподавателя
	 * @param file - Опциональный файл с фотографией преподавателя
	 * @returns Promise с созданным преподавателем
	 */
	public async createTeacher(
		dto: CreateTeacherDto,
		file?: Express.Multer.File,
	): Promise<Teacher> {
		const teacher = await this.prismaService.teacher.create({
			data: {
				name: dto.name,
				surname: dto.surname,
				patronymic: dto.patronymic,
				experience: dto.experience,
				direction: dto.direction,
				egeScore: dto.egeScore,
				category: dto.category,
				picture: '',
			},
		})

		if (file) {
			const picture = await this.fileService.uploadPicture(
				file,
				this.teacherPicturesDir,
			)

			const url = `${this.baseUrl}/teachers/${teacher.id}/picture/${picture}`

			return this.prismaService.teacher.update({
				where: { id: teacher.id },
				data: {
					picture: url,
				},
			})
		}

		return teacher
	}

	/**
	 * Получает список всех преподавателей с опциональной пагинацией
	 * @param page - Номер страницы (опционально)
	 * @param limit - Количество элементов на странице (опционально)
	 * @param category - Категория преподавателя (опционально)
	 * @returns Promise с массивом преподавателей или объектом с данными и метаинформацией
	 */
	public async getTeachers(
		page?: number,
		limit?: number,
		category?: TeacherCategory,
	): Promise<Teacher[] | { data: Teacher[]; meta: Meta }> {
		try {
			if (!page || !limit) {
				let teachers: Teacher[]

				if (category) {
					teachers = await this.prismaService.teacher.findMany({
						where: {
							category,
						},
						orderBy: {
							createdAt: 'desc',
						},
					})
				} else {
					teachers = await this.prismaService.teacher.findMany({
						orderBy: {
							createdAt: 'desc',
						},
					})
				}

				return teachers
			}

			const skip = (page - 1) * limit

			const [teachers, total] = await Promise.all([
				this.prismaService.teacher.findMany({
					skip,
					take: limit,
					orderBy: {
						createdAt: 'desc',
					},
				}),
				this.prismaService.teacher.count(),
			])

			return {
				data: teachers,
				meta: {
					total,
					page,
					limit,
					lastPage: Math.ceil(total / limit),
				},
			}
		} catch (error) {
			console.log(error)
			throw new BadRequestException('Неверный параметр category')
		}
	}

	/**
	 * Получает преподавателя по ID
	 * @param id - Уникальный идентификатор преподавателя
	 * @returns Promise с найденным преподавателем
	 * @throws NotFoundException если преподаватель не найден
	 */
	public async getTeacherById(id: string): Promise<Teacher> {
		if (!id) throw new NotFoundException('Идентификатор обязателен')

		const teacher = await this.prismaService.teacher.findUnique({
			where: {
				id,
			},
		})

		if (!teacher) {
			throw new NotFoundException('Преподаватель не найден')
		}

		return teacher
	}

	/**
	 * Частично обновляет данные преподавателя
	 * @param id - Уникальный идентификатор преподавателя
	 * @param dto - DTO с обновляемыми данными
	 * @returns Promise с обновленным преподавателем
	 * @throws NotFoundException если преподаватель не найден
	 */
	public async updateTeacher(
		id: string,
		dto: UpdateTeacherDto,
	): Promise<Teacher> {
		if (!id) throw new NotFoundException('Идентификатор обязателен')

		const teacher = await this.prismaService.teacher.findUnique({
			where: { id },
		})

		if (!teacher) {
			throw new NotFoundException('Преподаватель не найден')
		}

		const { ...updateData } = dto

		return this.prismaService.teacher.update({
			where: { id },
			data: updateData,
		})
	}

	/**
	 * Полностью заменяет данные преподавателя, сохраняя фотографию
	 * @param id - Уникальный идентификатор преподавателя
	 * @param dto - DTO с новыми данными
	 * @returns Promise с обновленным преподавателем
	 * @throws NotFoundException если преподаватель не найден
	 */
	public async replaceTeacher(
		id: string,
		dto: UpdateTeacherDto,
	): Promise<Teacher> {
		if (!id) throw new NotFoundException('Идентификатор обязателен')

		const teacher = await this.prismaService.teacher.findUnique({
			where: { id },
		})

		if (!teacher) {
			throw new NotFoundException('Преподаватель не найден')
		}

		return this.prismaService.teacher.update({
			where: { id },
			data: {
				...dto,
				picture: teacher.picture,
			},
		})
	}

	/**
	 * Обновляет фотографию преподавателя
	 * @param teacherId - Уникальный идентификатор преподавателя
	 * @param file - Новый файл фотографии
	 * @returns Promise с обновленным преподавателем
	 * @throws NotFoundException если преподаватель не найден
	 */
	public async updateTeacherPicture(
		teacherId: string,
		file: Express.Multer.File,
	): Promise<Teacher> {
		const teacher = await this.prismaService.teacher.findUnique({
			where: { id: teacherId },
		})

		if (!teacher) {
			throw new NotFoundException('Преподаватель не найден')
		}

		if (teacher.picture) {
			await this.fileService.deletePicture(
				this.teacherPicturesDir,
				teacher.picture.split('/').pop(),
			)
		}

		const picture = await this.fileService.uploadPicture(
			file,
			this.teacherPicturesDir,
		)

		const url = `${this.baseUrl}/teachers/${teacher.id}/picture/${picture}`

		return this.prismaService.teacher.update({
			where: { id: teacher.id },
			data: {
				picture: url,
			},
		})
	}

	/**
	 * Получает фотографию преподавателя
	 * @param teacherId - Уникальный идентификатор преподавателя
	 * @param pictureName - Имя файла фотографии
	 * @returns Promise с буфером изображения
	 * @throws NotFoundException если преподаватель или фотография не найдены
	 */
	public async getPicture(
		teacherId: string,
		pictureName: string,
	): Promise<Buffer> {
		const teacher = await this.prismaService.teacher.findUnique({
			where: { id: teacherId },
		})

		if (!teacher) {
			throw new NotFoundException('Преподаватель не найден')
		}

		if (!teacher.picture) {
			throw new NotFoundException('Фотография преподавателя не найдена')
		}

		return this.fileService.getPicture(this.teacherPicturesDir, pictureName)
	}

	/**
	 * Удаляет фотографию преподавателя
	 * @param teacherId - Уникальный идентификатор преподавателя
	 * @param pictureName - Имя файла фотографии
	 * @throws NotFoundException если преподаватель не найден
	 */
	public async deleteTeacherPicture(
		teacherId: string,
		pictureName: string,
	): Promise<void> {
		const teacher = await this.prismaService.teacher.findUnique({
			where: { id: teacherId },
		})

		if (!teacher) {
			throw new NotFoundException('Преподаватель не найден')
		}

		await this.fileService.deletePicture(
			this.teacherPicturesDir,
			pictureName,
		)

		await this.prismaService.teacher.update({
			where: { id: teacherId },
			data: {
				picture: '',
			},
		})
	}

	/**
	 * Удаляет преподавателя
	 * @param id - Уникальный идентификатор преподавателя
	 * @throws BadRequestException если id не предоставлен
	 */
	public async deleteTeacher(id: string): Promise<void> {
		if (!id) throw new BadRequestException('Идентификатор обязателен')

		return this.prismaService.teacher.delete({
			where: { id },
		}) as unknown as void
	}
}
