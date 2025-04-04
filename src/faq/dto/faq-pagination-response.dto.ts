import { ApiProperty } from '@nestjs/swagger'

import { FaqTransferDto } from './faq-transfer.dto'

export class FaqPaginationResponseDto {
	@ApiProperty({
		type: [FaqTransferDto],
		description: 'Array of FAQ entries',
	})
	data: FaqTransferDto[]

	@ApiProperty({
		type: 'object',
		properties: {
			total: {
				type: 'number',
				example: 100,
				description: 'Total number of FAQ entries',
			},
			page: {
				type: 'number',
				example: 1,
				description: 'Current page number',
			},
			limit: {
				type: 'number',
				example: 10,
				description: 'Number of items per page',
			},
			lastPage: {
				type: 'number',
				example: 10,
				description: 'Last page number',
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
