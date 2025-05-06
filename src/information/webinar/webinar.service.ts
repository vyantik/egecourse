import { Injectable, NotFoundException } from '@nestjs/common'
import { Webinar, WebinarStatus } from '@prisma/__generated__'

import { Meta } from '@/libs/common/utils/meta'
import { PrismaService } from '@/prisma/prisma.service'

import { CreateWebinarDto } from './dto/create-webinar.dto'

@Injectable()
export class WebinarService {
	constructor(private readonly prismaService: PrismaService) {}

	async getWebinars(
		page?: number,
		limit?: number,
	): Promise<Webinar[] | { data: Webinar[]; meta: Meta }> {
		if (!page || !limit) {
			return this.prismaService.webinar.findMany({
				orderBy: {
					createdAt: 'desc',
				},
			})
		}

		const skip = (page - 1) * limit

		const [webinars, total] = await Promise.all([
			this.prismaService.webinar.findMany({
				skip,
				take: limit,
				orderBy: {
					createdAt: 'desc',
				},
			}),
			this.prismaService.webinar.count(),
		])

		return {
			data: webinars,
			meta: {
				total,
				page,
				limit,
				lastPage: Math.ceil(total / limit),
			},
		}
	}

	async getWebinarById(id: string): Promise<Webinar> {
		const webinar = await this.prismaService.webinar.findUnique({
			where: { id },
		})

		if (!webinar) {
			throw new NotFoundException('Вебинар не найден')
		}

		return webinar
	}

	async createWebinar(dto: CreateWebinarDto): Promise<Webinar> {
		return this.prismaService.webinar.create({
			data: dto,
		})
	}

	async updateWebinarStatus(
		id: string,
		status: WebinarStatus,
	): Promise<Webinar> {
		const webinar = await this.prismaService.webinar.findUnique({
			where: { id },
		})

		if (!webinar) {
			throw new NotFoundException('Вебинар не найден')
		}

		return this.prismaService.webinar.update({
			where: { id },
			data: { status },
		})
	}
}
