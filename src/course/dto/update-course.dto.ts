import { ApiProperty } from '@nestjs/swagger'
import { IsObject, IsOptional, IsString } from 'class-validator'

export class UpdateCourseDto {
	@ApiProperty({
		example: 'Подготовка к ЕГЭ по математике',
		description: 'Название курса',
		required: false,
	})
	@IsString({ message: 'Название курса должно быть строкой' })
	@IsOptional()
	public name?: string

	@ApiProperty({
		example: 'Интенсивная подготовка к ЕГЭ по математике',
		description: 'Заголовок курса',
		required: false,
	})
	@IsString({ message: 'Заголовок курса должен быть строкой' })
	@IsOptional()
	public header?: string

	@ApiProperty({
		example: 'Подготовка к ЕГЭ по математике с нуля до 80+ баллов',
		description: 'Описание курса',
		required: false,
	})
	@IsString({ message: 'Описание курса должно быть строкой' })
	@IsOptional()
	public description?: string

	@ApiProperty({
		example: 'Онлайн',
		description: 'Формат обучения',
		required: false,
	})
	@IsString({ message: 'Формат обучения должен быть строкой' })
	@IsOptional()
	public studyFormat?: string

	@ApiProperty({
		example: 'Диплом о профессиональной переподготовке',
		description: 'Документ об окончании',
		required: false,
	})
	@IsString({ message: 'Документ об окончании должен быть строкой' })
	@IsOptional()
	public document?: string

	@ApiProperty({
		example: 'Сентябрь 2024',
		description: 'Дата начала обучения',
		required: false,
	})
	@IsString({ message: 'Дата начала обучения должна быть строкой' })
	@IsOptional()
	public studyStart?: string

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
}
