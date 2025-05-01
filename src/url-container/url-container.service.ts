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

/**
 * Сервис для управления URL-контейнерами
 * Предоставляет методы для создания, получения и обновления URL
 */
@Injectable()
export class UrlContainerService {
	/**
	 * Конструктор сервиса URL-контейнеров
	 * @param prisma - Сервис для работы с базой данных
	 */
	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Получает URL-контейнер по его идентификатору
	 * @param key - Уникальный ключ URL-контейнера
	 * @returns Promise с найденным URL-контейнером
	 * @throws NotFoundException если URL-контейнер не найден
	 */
	public async getUrlContainer(key: string) {
		const urlContainer = await this.prisma.urlContainer.findUnique({
			where: {
				key,
			},
		})

		if (!urlContainer) {
			throw new NotFoundException(`URL с ключом ${key} не найден`)
		}

		return urlContainer
	}

	/**
	 * Создает новый URL-контейнер
	 * @param dto - DTO с данными для создания URL-контейнера
	 * @returns Promise с созданным URL-контейнером
	 * @throws BadRequestException если URL уже существует или произошла ошибка при создании
	 */
	public async createUrlContainer(dto: CreateUrlContainerDto) {
		try {
			return await this.prisma.urlContainer.create({
				data: {
					key: dto.key,
					url: dto.url,
				},
			})
		} catch (error) {
			if (error.code === 'P2002') {
				throw new BadRequestException('Такой URL уже существует')
			}
			throw new BadRequestException('Не удалось создать URL-контейнер')
		}
	}

	/**
	 * Обновляет существующий URL-контейнер
	 * @param id - Уникальный идентификатор URL-контейнера
	 * @param dto - DTO с данными для обновления URL-контейнера
	 * @returns Promise с обновленным URL-контейнером
	 * @throws NotFoundException если URL-контейнер не найден
	 * @throws BadRequestException если URL уже существует или произошла ошибка при обновлении
	 */
	public async updateUrlContainer(key: string, dto: UpdateUrlContainerDto) {
		try {
			const exists = await this.prisma.urlContainer.findUnique({
				where: { key },
			})

			if (!exists) {
				throw new NotFoundException(`URL с ключом ${key} не найден`)
			}

			return await this.prisma.urlContainer.update({
				where: {
					key,
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
				throw new BadRequestException('Такой URL уже существует')
			}
			throw new BadRequestException('Не удалось обновить URL-контейнер')
		}
	}
}
