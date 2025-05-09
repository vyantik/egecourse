import { BadRequestException, Injectable } from '@nestjs/common'

import { UserService } from '@/core/user/user.service'
import { CourseService } from '@/information/course/course.service'
import { PrismaService } from '@/prisma/prisma.service'

import { ApplicationDto } from './dto/application.dto'

@Injectable()
export class ApplicationService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
		private readonly courseService: CourseService,
	) {}

	/**
	 * Создает заявку
	 * @param dto - Данные заявки
	 * @param id - ID пользователя
	 * @returns Promise с созданной заявкой
	 * @throws NotFoundException если пользователь не найден
	 */
	public async createApplication(dto: ApplicationDto, id: string) {
		const user = await this.userService.findById(id)

		const course = await this.courseService.findById(dto.courseId)

		if (course.category !== dto.category) {
			throw new BadRequestException(
				'Категория курса не совпадает с категорией заявки',
			)
		}

		return this.prismaService.application.create({
			data: {
				...dto,
				name: user.name + ' ' + user.surname + ' ' + user.patronymic,
			},
		})
	}

	public async getApplications() {
		return this.prismaService.application.findMany({
			include: {
				course: true,
			},
		})
	}
}
