import { ApiProperty } from '@nestjs/swagger'
import { CourseCategory } from '@prisma/__generated__'
import { Exclude } from 'class-transformer'
import { Type } from 'class-transformer'
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator'

import { PriceOptionStructureDto } from '../dto/course.dto'

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
		description: 'Категория курса',
		example: 'EXAM',
		enum: ['EXAM', 'EDUCATION', 'RAINBOW'],
		type: 'string',
	})
	@IsEnum(CourseCategory)
	category: CourseCategory

	@ApiProperty({
		example: [
			{
				name: 'basic',
				price: 15000,
				features: ['Доступ к материалам', 'Проверка домашних заданий'],
				duration: 3,
			},
			{
				name: 'premium',
				price: 25000,
				features: [
					'Доступ к материалам',
					'Проверка домашних заданий',
					'Индивидуальные консультации',
				],
				duration: 6,
			},
		],
		description: 'Варианты цен и их особенности',
		required: false,
		type: () => [PriceOptionStructureDto],
	})
	@IsArray({ message: 'Ценовые опции должны быть массивом' })
	@ValidateNested({ each: true })
	@Type(() => PriceOptionStructureDto)
	@IsOptional()
	public priceOptions?: PriceOptionStructureDto[]

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date

	constructor(partial: Partial<CourseResponseEntity>) {
		Object.assign(this, partial)
	}
}
