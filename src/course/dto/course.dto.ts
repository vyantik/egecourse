import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator'

export class PriceOptionDto {
	@ApiProperty({
		example: '3 months',
		description: 'Duration of the study period',
	})
	@IsString({ message: 'Study time must be a string' })
	@IsNotEmpty({ message: 'Study time is required' })
	studyTime: string

	@ApiProperty({
		example: '10000',
		description: 'Price for the specified study period',
	})
	@IsString({ message: 'Price must be a string' })
	@IsNotEmpty({ message: 'Price is required' })
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
