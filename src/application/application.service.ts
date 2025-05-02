import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

import { ApplicationDto } from './dto/application.dto'

@Injectable()
export class ApplicationService {
	constructor(private readonly prismaService: PrismaService) {}

	public async createApplication(dto: ApplicationDto, id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id,
			},
		})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return this.prismaService.application.create({
			data: {
				...dto,
				name: user.name + ' ' + user.surname + ' ' + user.patronymic,
			},
		})
	}
}
