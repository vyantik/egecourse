import { ApiProperty } from '@nestjs/swagger'
import { CourseCategory } from '@prisma/__generated__'

export class TeacherTransferDto {
	@ApiProperty({
		example: '550e8400-e29b-41d4-a716-446655440000',
		description: 'Уникальный идентификатор преподавателя',
	})
	public id: string

	@ApiProperty({
		example: 'Иван',
		description: 'Имя преподавателя',
	})
	public name: string

	@ApiProperty({
		example: 'Иванов',
		description: 'Фамилия преподавателя',
	})
	public surname: string

	@ApiProperty({
		example: 'Иванович',
		description: 'Отчество преподавателя',
	})
	public patronymic: string

	@ApiProperty({
		example: 'EXAM',
		description: 'Категория преподавателя',
		enum: CourseCategory,
		type: () => CourseCategory,
	})
	public category: CourseCategory

	@ApiProperty({
		example: 'https://example.com/teacher-photo.jpg',
		description: 'URL фотографии преподавателя',
		required: false,
	})
	public picture?: string

	@ApiProperty({
		example: '5 лет',
		description: 'Опыт работы преподавателя',
	})
	public experience: string

	@ApiProperty({
		example: 95,
		description: 'Балл ЕГЭ преподавателя',
	})
	public egeScore: number

	@ApiProperty({
		example: 'Математика',
		description: 'Направление подготовки преподавателя',
	})
	public direction: string

	@ApiProperty({
		example: '2024-03-20T12:00:00.000Z',
		description: 'Дата создания записи',
	})
	public createdAt: Date

	@ApiProperty({
		example: '2024-03-20T12:00:00.000Z',
		description: 'Дата последнего обновления записи',
	})
	public updatedAt: Date
}
