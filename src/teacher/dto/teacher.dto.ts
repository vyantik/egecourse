import { ApiProperty } from '@nestjs/swagger'
import { TeacherCategory } from '@prisma/__generated__'
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
	@IsString()
	@IsNotEmpty()
	public name: string

	@ApiProperty({
		example: 'Иванов',
		description: 'Фамилия преподавателя',
	})
	@IsString()
	@IsNotEmpty()
	public surname: string

	@ApiProperty({
		example: 'Иванович',
		description: 'Отчество преподавателя',
	})
	@IsString()
	@IsNotEmpty()
	public patronymic: string

	@ApiProperty({
		example: 'EGE',
		description: 'Категория преподавателя',
		enum: TeacherCategory,
	})
	@IsEnum(TeacherCategory)
	@IsNotEmpty()
	public category: TeacherCategory

	@ApiProperty({
		example: 'https://example.com/teacher-photo.jpg',
		description: 'URL фотографии преподавателя',
		required: false,
	})
	@IsString()
	@IsOptional()
	public picture?: string

	@ApiProperty({
		example: '5 лет',
		description: 'Опыт работы преподавателя',
	})
	@IsString()
	@IsNotEmpty()
	public experience: string

	@ApiProperty({
		example: 95,
		description: 'Балл ЕГЭ преподавателя (от 0 до 100)',
		minimum: 0,
		maximum: 100,
	})
	@IsInt()
	@Min(0)
	@Max(100)
	public egeScore: number

	@ApiProperty({
		example: 'Математика',
		description: 'Направление подготовки преподавателя',
	})
	@IsString()
	@IsNotEmpty()
	public direction: string
}
