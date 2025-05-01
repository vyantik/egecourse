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
	@IsString()
	@IsNotEmpty()
	public name: string

	@ApiProperty({
		example: 'Интенсивная подготовка к ЕГЭ по математике',
		description: 'Заголовок курса',
	})
	@IsString()
	@IsNotEmpty()
	public header: string

	@ApiProperty({
		example: 'Подготовка к ЕГЭ по математике с нуля до 80+ баллов',
		description: 'Описание курса',
	})
	@IsString()
	@IsNotEmpty()
	public description: string

	@ApiProperty({
		example: 'Онлайн',
		description: 'Формат обучения',
	})
	@IsString()
	@IsNotEmpty()
	public studyFormat: string

	@ApiProperty({
		example: 'Диплом о профессиональной переподготовке',
		description: 'Документ об окончании',
	})
	@IsString()
	@IsNotEmpty()
	public document: string

	@ApiProperty({
		example: 'Сентябрь 2024',
		description: 'Дата начала обучения',
	})
	@IsString()
	@IsNotEmpty()
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
	@IsObject()
	@IsOptional()
	public priceOptions?: Record<string, any>
}
