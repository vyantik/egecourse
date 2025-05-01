import { ApiProperty } from '@nestjs/swagger'
import { TeacherCategory } from '@prisma/__generated__'
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class UpdateTeacherDto {
	@ApiProperty({
		example: 'Иван',
		description: 'Имя преподавателя',
		required: false,
	})
	@IsString()
	@IsOptional()
	public name?: string

	@ApiProperty({
		example: 'Иванов',
		description: 'Фамилия преподавателя',
		required: false,
	})
	@IsString()
	@IsOptional()
	public surname?: string

	@ApiProperty({
		example: 'Иванович',
		description: 'Отчество преподавателя',
		required: false,
	})
	@IsString()
	@IsOptional()
	public patronymic?: string

	@ApiProperty({
		example: 'EGE',
		description: 'Категория преподавателя',
		enum: TeacherCategory,
		required: false,
	})
	@IsEnum(TeacherCategory)
	@IsOptional()
	public category?: TeacherCategory

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
		required: false,
	})
	@IsString()
	@IsOptional()
	public experience?: string

	@ApiProperty({
		example: 95,
		description: 'Балл ЕГЭ преподавателя (от 0 до 100)',
		minimum: 0,
		maximum: 100,
		required: false,
	})
	@IsInt()
	@Min(0)
	@Max(100)
	@IsOptional()
	public egeScore?: number

	@ApiProperty({
		example: 'Математика',
		description: 'Направление подготовки преподавателя',
		required: false,
	})
	@IsString()
	@IsOptional()
	public direction?: string
}
