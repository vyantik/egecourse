import { ApiProperty } from '@nestjs/swagger'

import { FaqDto } from './faq.dto'

export class FaqTransferDto extends FaqDto {
	@ApiProperty({
		example: '550e8400-e29b-41d4-a716-446655440000',
		description: 'Уникальный идентификатор',
	})
	id: string

	@ApiProperty({
		example: '2023-01-01T00:00:00.000Z',
		description: 'Дата создания',
	})
	createdAt: Date

	@ApiProperty({
		example: '2023-01-01T00:00:00.000Z',
		description: 'Дата последнего обновления',
	})
	updatedAt: Date
}
