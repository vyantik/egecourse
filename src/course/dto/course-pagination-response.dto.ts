import { ApiProperty } from '@nestjs/swagger'

import { CourseTransferDto } from './course-transfer.dto'

export class CoursePaginationResponseDto {
	@ApiProperty({
		type: [CourseTransferDto],
		description: 'Array of course entries',
	})
	data: CourseTransferDto[]

	@ApiProperty({
		type: 'object',
		properties: {
			total: {
				type: 'number',
				example: 100,
				description: 'Total number of course entries',
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
