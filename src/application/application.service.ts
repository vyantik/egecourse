import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

import { ApplicationDto } from './dto/application.dto'

@Injectable()
export class ApplicationService {
	constructor(private readonly prismaService: PrismaService) {}

	/**
	 * Создает заявку
	 * @param dto - Данные заявки
	 * @param id - ID пользователя
	 * @returns Promise с созданной заявкой
	 * @throws NotFoundException если пользователь не найден
	 */
	public async createApplication(dto: ApplicationDto, id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id,
			},
		})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		const course = await this.prismaService.course.findUnique({
			where: {
				id: dto.courseId,
			},
		})

		if (!course) {
			throw new NotFoundException('Course not found')
		}

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
