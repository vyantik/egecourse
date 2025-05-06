import { ApiProperty } from '@nestjs/swagger'
import { TeacherCategory } from '@prisma/__generated__'
import { Transform } from 'class-transformer'
import {
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Max,
	Min,
} from 'class-validator'

export class CreateTeacherDto {
	@ApiProperty({
		example: 'Иван',
		description: 'Имя преподавателя',
	})
	@IsString({ message: 'Имя должно быть строкой' })
	@IsNotEmpty({ message: 'Имя обязательно' })
	public name: string

	@ApiProperty({
		example: 'Иванов',
		description: 'Фамилия преподавателя',
	})
	@IsString({ message: 'Фамилия должна быть строкой' })
	@IsNotEmpty({ message: 'Фамилия обязательна' })
	public surname: string

	@ApiProperty({
		example: 'Иванович',
		description: 'Отчество преподавателя',
	})
	@IsString({ message: 'Отчество должно быть строкой' })
	@IsNotEmpty({ message: 'Отчество обязательно' })
	public patronymic: string

	@ApiProperty({
		example: 'EXAM',
		description: 'Категория преподавателя',
		enum: TeacherCategory,
	})
	@IsEnum(TeacherCategory, {
		message: 'Некорректная категория преподавателя',
	})
	@IsNotEmpty({ message: 'Категория обязательна' })
	@Transform(({ value }) => value?.toUpperCase())
	public category: TeacherCategory

	@ApiProperty({
		example: 'https://example.com/teacher-photo.jpg',
		description: 'URL фотографии преподавателя',
		required: false,
	})
	@IsString({ message: 'URL фотографии должен быть строкой' })
	@IsOptional()
	public picture?: string

	@ApiProperty({
		example: '5 лет',
		description: 'Опыт работы преподавателя',
	})
	@IsString({ message: 'Опыт работы должен быть строкой' })
	@IsNotEmpty({ message: 'Опыт работы обязателен' })
	public experience: string

	@ApiProperty({
		example: 95,
		description: 'Балл ЕГЭ преподавателя (от 0 до 100)',
		minimum: 0,
		maximum: 100,
	})
	@IsInt({ message: 'Балл ЕГЭ должен быть целым числом' })
	@Min(0, { message: 'Балл ЕГЭ не может быть меньше 0' })
	@Max(100, { message: 'Балл ЕГЭ не может быть больше 100' })
	@Transform(({ value }) => parseInt(value, 10))
	public egeScore: number

	@ApiProperty({
		example: 'Математика',
		description: 'Направление подготовки преподавателя',
	})
	@IsString({ message: 'Направление должно быть строкой' })
	@IsNotEmpty({ message: 'Направление обязательно' })
	public direction: string
}
