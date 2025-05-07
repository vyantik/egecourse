import { ApiProperty } from '@nestjs/swagger'
import { CourseCategory } from '@prisma/__generated__'
import { Type } from 'class-transformer'
import {
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator'

export class PriceOptionStructureDto {
	@ApiProperty({
		example: 'basic',
		description: 'Название тарифного плана',
	})
	@IsString({ message: 'Название тарифа должно быть строкой' })
	@IsNotEmpty({ message: 'Название тарифа обязательно' })
	name: string

	@ApiProperty({
		example: 15000,
		description: 'Цена за указанный период обучения',
	})
	@IsNumber({}, { message: 'Цена должна быть числом' })
	@IsNotEmpty({ message: 'Цена обязательна' })
	price: number

	@ApiProperty({
		example: ['Доступ к материалам', 'Проверка домашних заданий'],
		description: 'Список возможностей/особенностей тарифа',
	})
	@IsArray({ message: 'Особенности должны быть массивом' })
	@ArrayMinSize(1, {
		message: 'Должна быть указана хотя бы одна особенность',
	})
	@IsString({ each: true, message: 'Каждая особенность должна быть строкой' })
	features: string[]

	@ApiProperty({
		example: 3,
		description: 'Продолжительность обучения в месяцах',
	})
	@IsNumber({}, { message: 'Продолжительность должна быть числом' })
	@IsNotEmpty({ message: 'Продолжительность обязательна' })
	duration: number
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
		example: 'EXAM',
		description: 'Категория курса',
		enum: CourseCategory,
	})
	@IsEnum(CourseCategory, { message: 'Категория курса должна быть строкой' })
	@IsNotEmpty({ message: 'Категория курса обязательна' })
	public category: CourseCategory

	@ApiProperty({
		example: 'Сентябрь 2024',
		description: 'Дата начала обучения',
	})
	@IsString({ message: 'Дата начала обучения должна быть строкой' })
	@IsNotEmpty({ message: 'Дата начала обучения обязательна' })
	public studyStart: string

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
	})
	@IsArray({ message: 'Ценовые опции должны быть массивом' })
	@ValidateNested({ each: true })
	@Type(() => PriceOptionStructureDto)
	@IsOptional()
	public priceOptions?: PriceOptionStructureDto[]
}
