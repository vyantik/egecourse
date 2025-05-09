import { Injectable } from '@nestjs/common'

import { FaqDto } from '@/information/faq/dto/faq.dto'
import {
	UpdateFaqDto,
	UpdateFullFaqDto,
} from '@/information/faq/dto/update-faq.dto'
import { FaqService } from '@/information/faq/faq.service'

@Injectable()
export class AdminFaqService {
	constructor(private readonly faqService: FaqService) {}

	/**
	 * Создает новый FAQ
	 * @param dto - Данные для создания FAQ
	 * @returns Promise с созданным FAQ
	 */
	public async createFaq(dto: FaqDto) {
		return this.faqService.createFaq(dto)
	}

	/**
	 * Обновляет существующий FAQ
	 * @param id - ID FAQ
	 * @param dto - Данные для обновления FAQ
	 * @returns Promise с обновленным FAQ
	 */
	public async updateFaq(id: string, dto: UpdateFaqDto) {
		return this.faqService.updateFaq(id, dto)
	}

	/**
	 * Заменяет существующий FAQ
	 * @param id - ID FAQ
	 * @param dto - Данные для замены FAQ
	 * @returns Promise с замененным FAQ
	 */
	public async replaceFaq(id: string, dto: UpdateFullFaqDto) {
		return this.faqService.replaceFaq(id, dto)
	}
}
