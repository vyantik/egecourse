import { ApiProperty } from '@nestjs/swagger'

import { FaqTransferDto } from './faq-transfer.dto'

export class FaqPaginationResponseDto {
	@ApiProperty({
		type: [FaqTransferDto],
		description: 'Массив FAQ',
	})
	data: FaqTransferDto[]

	@ApiProperty({
		type: 'object',
		properties: {
			total: {
				type: 'number',
				example: 100,
				description: 'Общее количество FAQ',
			},
			page: {
				type: 'number',
				example: 1,
				description: 'Текущая страница',
			},
			limit: {
				type: 'number',
				example: 10,
				description: 'Количество элементов на странице',
			},
			lastPage: {
				type: 'number',
				example: 10,
				description: 'Номер последней страницы',
			},
		},
	})
	meta: {
		total: number
		page: number
		limit: number
		lastPage: number
	}
}
