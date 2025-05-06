import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator'

export class PriceOptionDto {
	@ApiProperty({
		example: '3 месяца',
		description: 'Продолжительность периода обучения',
	})
	@IsString({ message: 'Время обучения должно быть строкой' })
	@IsNotEmpty({ message: 'Время обучения обязательно' })
	studyTime: string

	@ApiProperty({
		example: '10000',
		description: 'Цена за указанный период обучения',
	})
	@IsString({ message: 'Цена должна быть строкой' })
	@IsNotEmpty({ message: 'Цена обязательна' })
	price: string
}

export class CourseDto {
	@ApiProperty({
		example: 'Подготовка к ЕГЭ по математике',
		description: 'Название курса',
	})
	@IsString({ message: 'Название курса должно быть строкой' })
	@IsNotEmpty({ message: 'Название курса обязательно' })
	public name: string

	@ApiProperty({
		example: 'Интенсивная подготовка к ЕГЭ по математике',
		description: 'Заголовок курса',
	})
	@IsString({ message: 'Заголовок курса должен быть строкой' })
	@IsNotEmpty({ message: 'Заголовок курса обязателен' })
	public header: string

	@ApiProperty({
		example: 'Подготовка к ЕГЭ по математике с нуля до 80+ баллов',
		description: 'Описание курса',
	})
	@IsString({ message: 'Описание курса должно быть строкой' })
	@IsNotEmpty({ message: 'Описание курса обязательно' })
	public description: string

	@ApiProperty({
		example: 'Онлайн',
		description: 'Формат обучения',
	})
	@IsString({ message: 'Формат обучения должен быть строкой' })
	@IsNotEmpty({ message: 'Формат обучения обязателен' })
	public studyFormat: string

	@ApiProperty({
		example: 'Диплом о профессиональной переподготовке',
		description: 'Документ об окончании',
	})
	@IsString({ message: 'Документ об окончании должен быть строкой' })
	@IsNotEmpty({ message: 'Документ об окончании обязателен' })
	public document: string

	@ApiProperty({
		example: 'Сентябрь 2024',
		description: 'Дата начала обучения',
	})
	@IsString({ message: 'Дата начала обучения должна быть строкой' })
	@IsNotEmpty({ message: 'Дата начала обучения обязательна' })
	public studyStart: string

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
