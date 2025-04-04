import { ApiProperty } from '@nestjs/swagger'

import { TeacherTransferDto } from './teacher-transfer.dto'

export class TeacherPaginationResponseDto {
	@ApiProperty({
		type: [TeacherTransferDto],
		description: 'Array of teachers',
	})
	data: TeacherTransferDto[]

	@ApiProperty({
		type: 'object',
		properties: {
			total: {
				type: 'number',
				example: 100,
				description: 'Total number of teachers',
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
