import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { IsObject } from 'class-validator'

export class CourseResponseEntity {
	@ApiProperty({
		description: 'Уникальный идентификатор курса',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	id: string

	@ApiProperty({
		description: 'Название курса',
		example: 'Подготовка к ЕГЭ по математике',
	})
	name: string

	@ApiProperty({
		description: 'Описание курса',
		example:
			'Комплексная подготовка к ЕГЭ по математике с опытными преподавателями',
	})
	description: string

	@ApiProperty({
		description: 'Заголовок курса',
		example: 'ЕГЭ по математике 2024',
	})
	header: string

	@ApiProperty({
		description: 'Формат обучения',
		example: 'Онлайн',
	})
	studyFormat: string

	@ApiProperty({
		description: 'Документ об окончании',
		example: 'Сертификат',
	})
	document: string

	@ApiProperty({
		description: 'Дата начала обучения',
		example: '2024-09-01',
	})
	studyStart: string

	@ApiProperty({
		example: {
			basic: {
				price: 15000,
				features: ['Доступ к материалам', 'Проверка домашних заданий'],
			},
			premium: {
				price: 25000,
				features: [
					'Доступ к материалам',
					'Проверка домашних заданий',
					'Индивидуальные консультации',
				],
			},
		},
		description: 'Варианты цен и их особенности',
		required: false,
	})
	@IsObject({ message: 'Ценовые опции должны быть объектом' })
	@IsOptional()
	public priceOptions?: Record<string, any>

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date

	constructor(partial: Partial<CourseResponseEntity>) {
		Object.assign(this, partial)
	}
}
