import { Injectable } from '@nestjs/common'
import { WebinarStatus } from '@prisma/__generated__'

import { CreateWebinarDto } from '@/information/webinar/dto/create-webinar.dto'
import { WebinarService } from '@/information/webinar/webinar.service'

@Injectable()
export class AdminWebinarService {
	constructor(private readonly webinarService: WebinarService) {}

	/**
	 * Создает новый вебинар
	 * @param dto - Данные для создания вебинара
	 * @returns Promise с созданным вебинаром
	 */
	public async createWebinar(dto: CreateWebinarDto) {
		return this.webinarService.createWebinar(dto)
	}

	/**
	 * Обновляет статус вебинара
	 * @param id - ID вебинара
	 * @param status - Новый статус вебинара
	 * @returns Promise с обновленным вебинаром
	 */
	public async updateWebinarStatus(id: string, status: WebinarStatus) {
		return this.webinarService.updateWebinarStatus(id, status)
	}
}
