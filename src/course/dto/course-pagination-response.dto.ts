import { ApiProperty } from '@nestjs/swagger'

import { CourseTransferDto } from './course-transfer.dto'

export class CoursePaginationResponseDto {
	@ApiProperty({
		type: [CourseTransferDto],
		description: 'Массив курсов',
	})
	data: CourseTransferDto[]

	@ApiProperty({
		type: 'object',
		properties: {
			total: {
				type: 'number',
				example: 100,
				description: 'Общее количество курсов',
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
