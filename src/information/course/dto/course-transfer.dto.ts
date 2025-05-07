import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsObject, IsOptional, ValidateNested } from 'class-validator'

import { PriceOptionStructureDto } from './course.dto'

export class CourseTransferDto {
	@ApiProperty({
		example: '550e8400-e29b-41d4-a716-446655440000',
		description: 'Уникальный идентификатор курса',
	})
	public id: string

	@ApiProperty({
		example: 'Подготовка к ЕГЭ по математике',
		description: 'Название курса',
	})
	public name: string

	@ApiProperty({
		example: 'Интенсивная подготовка к ЕГЭ по математике',
		description: 'Заголовок курса',
	})
	public header: string

	@ApiProperty({
		example: 'Подготовка к ЕГЭ по математике с нуля до 80+ баллов',
		description: 'Описание курса',
	})
	public description: string

	@ApiProperty({
		example: 'Онлайн',
		description: 'Формат обучения',
	})
	public studyFormat: string

	@ApiProperty({
		example: 'Диплом о профессиональной переподготовке',
		description: 'Документ об окончании',
	})
	public document: string

	@ApiProperty({
		example: 'Сентябрь 2024',
		description: 'Дата начала обучения',
	})
	public studyStart: string

	@ApiProperty({
		example: {
			basic: {
				price: 15000,
				features: ['Доступ к материалам', 'Проверка домашних заданий'],
				duration: 3,
			},
			premium: {
				price: 25000,
				features: [
					'Доступ к материалам',
					'Проверка домашних заданий',
					'Индивидуальные консультации',
				],
				duration: 6,
			},
		},
		description: 'Варианты цен и их особенности',
		required: false,
	})
	@IsObject({ message: 'Ценовые опции должны быть объектом' })
	@ValidateNested({ each: true })
	@Type(() => PriceOptionStructureDto)
	@IsOptional()
	public priceOptions?: Record<string, PriceOptionStructureDto>

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
