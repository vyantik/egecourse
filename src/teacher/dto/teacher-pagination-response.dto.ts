import { ApiProperty } from '@nestjs/swagger'

import { TeacherTransferDto } from './teacher-transfer.dto'

export class TeacherPaginationResponseDto {
	@ApiProperty({
		description: 'Список преподавателей',
		type: [TeacherTransferDto],
		example: [
			{
				id: '550e8400-e29b-41d4-a716-446655440000',
				name: 'Иван',
				surname: 'Иванов',
				patronymic: 'Иванович',
				category: 'EGE',
				picture: 'https://example.com/teacher-photo.jpg',
				experience: '5 лет',
				egeScore: 95,
				direction: 'Математика',
				createdAt: '2024-03-20T12:00:00.000Z',
				updatedAt: '2024-03-20T12:00:00.000Z',
			},
		],
	})
	public items: TeacherTransferDto[]

	@ApiProperty({
		example: 100,
		description: 'Общее количество преподавателей',
	})
	public total: number

	@ApiProperty({
		example: 1,
		description: 'Текущая страница',
	})
	public page: number

	@ApiProperty({
		example: 10,
		description: 'Количество элементов на странице',
	})
	public limit: number

	@ApiProperty({
		example: 10,
		description: 'Общее количество страниц',
	})
	public totalPages: number
}
