import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

import {
	CreateUrlContainerDto,
	UpdateUrlContainerDto,
} from './dto/url-container.dto'

@Injectable()
export class UrlContainerService {
	constructor(private readonly prisma: PrismaService) {}

	public async getUrlContainer(id: string) {
		const urlContainer = await this.prisma.urlContainer.findUnique({
			where: {
				id,
			},
		})

		if (!urlContainer) {
			throw new NotFoundException(`URL с id ${id} не найден`)
		}

		return urlContainer
	}

	public async createUrlContainer(dto: CreateUrlContainerDto) {
		try {
			return await this.prisma.urlContainer.create({
				data: {
					url: dto.url,
				},
			})
		} catch (error) {
			if (error.code === 'P2002') {
				throw new BadRequestException('URL уже существует')
			}
			throw new BadRequestException('Не удалось создать URL')
		}
	}

	public async updateUrlContainer(id: string, dto: UpdateUrlContainerDto) {
		try {
			const exists = await this.prisma.urlContainer.findUnique({
				where: { id },
			})

			if (!exists) {
				throw new NotFoundException(`URL с id ${id} не найден`)
			}

			return await this.prisma.urlContainer.update({
				where: {
					id,
				},
				data: {
					url: dto.url,
				},
			})
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error
			}
			if (error.code === 'P2002') {
				throw new BadRequestException('URL уже существует')
			}
			throw new BadRequestException('Не удалось обновить URL')
		}
	}
}
