import { Injectable } from '@nestjs/common'

import {
	CreateUrlContainerDto,
	UpdateUrlContainerDto,
} from '@/information/url-container/dto/url-container.dto'
import { UrlContainerService } from '@/information/url-container/url-container.service'

@Injectable()
export class AdminUrlContainerService {
	constructor(private readonly urlContainerService: UrlContainerService) {}

	/**
	 * Создает новый URL-контейнер
	 * @param dto - Данные для создания URL-контейнера
	 * @returns Promise с созданным URL-контейнером
	 */
	public async createUrlContainer(dto: CreateUrlContainerDto) {
		return this.urlContainerService.createUrlContainer(dto)
	}

	/**
	 * Обновляет URL-контейнер
	 * @param key - Ключ URL-контейнера
	 * @param dto - Данные для обновления URL-контейнера
	 * @returns Promise с обновленным URL-контейнером
	 */
	public async updateUrlContainer(key: string, dto: UpdateUrlContainerDto) {
		return this.urlContainerService.updateUrlContainer(key, dto)
	}
}
