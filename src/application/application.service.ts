import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

import { ApplicationDto } from './dto/application.dto'

@Injectable()
export class ApplicationService {
	constructor(private readonly prismaService: PrismaService) {}

	public async createApplication(dto: ApplicationDto) {
		return this.prismaService.application.create({
			data: dto,
		})
	}
}
