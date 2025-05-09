import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Course, CourseCategory } from '@prisma/__generated__'
import { plainToInstance } from 'class-transformer'

import { UserService } from '@/core/user/user.service'
import { Meta } from '@/libs/common/utils/meta'
import { PrismaService } from '@/prisma/prisma.service'

import { CourseDto } from './dto/course.dto'
import { UpdateCourseDto } from './dto/update-course.dto'
import { CourseResponseEntity } from './entities/course-response.entity'

/**
 * Сервис для управления курсами
 * Предоставляет методы для создания, получения и обновления курсов,
 * включая управление ценовыми опциями
 */
@Injectable()
export class CourseService {
	/**
	 * Конструктор сервиса курсов
	 * @param prismaService - Сервис для работы с базой данных
	 */
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
	) {}

	public async findById(id: string) {
		const course = await this.prismaService.course.findUnique({
			where: { id },
		})

		if (!course) {
			throw new NotFoundException('Курс не найден')
		}

		return plainToInstance(CourseResponseEntity, course, {
			excludeExtraneousValues: false,
		})
	}

	/**
	 * Создает новый курс
	 * @param dto - DTO с данными курса
	 * @returns Promise с созданным курсом
	 *
	 * Отдельно обрабатывает priceOptions, преобразуя их в JSON
	 * для корректного хранения в базе данных
	 */
	public async createCourse(dto: CourseDto): Promise<Course> {
		const { priceOptions, ...courseData } = dto

		return this.prismaService.course.create({
			data: {
				...courseData,
				priceOptions: priceOptions
					? JSON.parse(JSON.stringify(priceOptions))
					: null,
			},
		})
	}

	/**
	 * Получает список всех курсов с опциональной пагинацией
	 * @param page - Номер страницы (опционально)
	 * @param limit - Количество элементов на странице (опционально)
	 * @returns Promise с массивом курсов или объектом с данными и метаинформацией
	 *
	 * Если параметры пагинации не указаны, возвращает все курсы.
	 * Если указаны page и limit, возвращает объект с курсами и метаданными пагинации.
	 * В обоих случаях курсы сортируются по дате создания (сначала новые).
	 */
	public async getCourses(
		page?: number,
		limit?: number,
		category?: CourseCategory,
	): Promise<Course[] | { data: Course[]; meta: Meta }> {
		if (!page || !limit) {
			let courses: Course[]
			if (category) {
				courses = await this.prismaService.course.findMany({
					where: { category },
					orderBy: {
						createdAt: 'desc',
					},
				})
			} else {
				courses = await this.prismaService.course.findMany({
					orderBy: {
						createdAt: 'desc',
					},
				})
			}

			return courses
		}

		const skip = (page - 1) * limit

		let courses: Course[]
		let total: number

		if (category) {
			;[courses, total] = await Promise.all([
				this.prismaService.course.findMany({
					where: { category },
					skip,
					take: limit,
					orderBy: {
						createdAt: 'desc',
					},
				}),
				this.prismaService.course.count({ where: { category } }),
			])
		} else {
			;[courses, total] = await Promise.all([
				this.prismaService.course.findMany({
					skip,
					take: limit,
					orderBy: {
						createdAt: 'desc',
					},
				}),
				this.prismaService.course.count(),
			])
		}

		return {
			data: courses,
			meta: {
				total,
				page,
				limit,
				lastPage: Math.ceil(total / limit),
			},
		}
	}

	/**
	 * Получает курс по его идентификатору
	 * @param id - Уникальный идентификатор курса
	 * @returns Promise с найденным курсом
	 * @throws NotFoundException если id не предоставлен или курс не найден
	 */
	public async getCourseById(id: string): Promise<Course> {
		if (!id) throw new NotFoundException('Идентификатор курса обязателен')

		const course = await this.prismaService.course.findUnique({
			where: {
				id,
			},
		})

		if (!course) {
			throw new NotFoundException('Курс не найден')
		}

		return course
	}

	/**
	 * Частично обновляет данные курса
	 * @param id - Уникальный идентификатор курса
	 * @param dto - DTO с обновляемыми полями
	 * @returns Promise с обновленным курсом
	 * @throws NotFoundException если id не предоставлен или курс не найден
	 *
	 * Позволяет обновить отдельные поля курса, включая priceOptions.
	 * Существующие поля, не указанные в dto, остаются без изменений.
	 */
	public async updateCourse(
		id: string,
		dto: UpdateCourseDto,
	): Promise<Course> {
		if (!id) throw new NotFoundException('Идентификатор курса обязателен')

		await this.findById(id)

		const { priceOptions, ...courseData } = dto

		return this.prismaService.course.update({
			where: { id },
			data: {
				...courseData,
				...(priceOptions && {
					priceOptions: JSON.parse(JSON.stringify(priceOptions)),
				}),
			},
		})
	}

	/**
	 * Полностью заменяет данные курса
	 * @param id - Уникальный идентификатор курса
	 * @param dto - DTO с полными данными для замены
	 * @returns Promise с обновленным курсом
	 * @throws NotFoundException если id не предоставлен или курс не найден
	 *
	 * Заменяет все данные курса на новые, указанные в dto.
	 * Все существующие данные, не указанные в dto, будут удалены или заменены значениями по умолчанию.
	 */
	public async replaceCourse(id: string, dto: CourseDto): Promise<Course> {
		if (!id) throw new NotFoundException('Идентификатор курса обязателен')

		await this.findById(id)

		const { priceOptions, ...courseData } = dto

		return this.prismaService.course.update({
			where: { id },
			data: {
				...courseData,
				priceOptions: priceOptions
					? JSON.parse(JSON.stringify(priceOptions))
					: null,
			},
		})
	}

	/**
	 * Подписывает пользователя на курс
	 * @param courseId - Идентификатор курса
	 * @param userId - Идентификатор пользователя
	 * @returns Promise с обновленным курсом
	 * @throws NotFoundException если курс или пользователь не найдены
	 */
	public async subscribeToCourse(courseId: string, userId: string) {
		return this.prismaService.$transaction(async prisma => {
			const course = await prisma.course.findUnique({
				where: { id: courseId },
				include: { users: true },
			})

			if (!course) {
				throw new NotFoundException('Курс не найден')
			}

			const user = await this.userService.findByIdWithCourses(userId)

			if (!user) {
				throw new NotFoundException('Пользователь не найден')
			}

			if (user.courses.some(c => c.id === courseId)) {
				throw new ConflictException(
					'Пользователь уже подписан на этот курс',
				)
			}

			return prisma.course.update({
				where: { id: courseId },
				data: {
					users: {
						connect: { id: userId },
					},
				},
				include: {
					users: true,
				},
			})
		})
	}

	/**
	 * Удаляет курс по его идентификатору
	 * @param id - Уникальный идентификатор курса
	 * @returns Promise с сообщением об удалении курса
	 * @throws NotFoundException если курс не найден
	 */
	public async deleteCourse(id: string) {
		await this.findById(id)

		await this.prismaService.course.delete({
			where: { id },
		})

		return {
			message: 'Курс удален',
		}
	}
}
