import { ApiProperty } from '@nestjs/swagger'

import { FaqDto } from './faq.dto'

export class FaqTransferDto extends FaqDto {
	@ApiProperty({
		example: '550e8400-e29b-41d4-a716-446655440000',
		description: 'Unique identifier',
	})
	id: string

	@ApiProperty({
		example: '2023-01-01T00:00:00.000Z',
		description: 'Creation date',
	})
	createdAt: Date

	@ApiProperty({
		example: '2023-01-01T00:00:00.000Z',
		description: 'Last update date',
	})
	updatedAt: Date
}
