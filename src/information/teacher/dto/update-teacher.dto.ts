import { ApiProperty } from '@nestjs/swagger'
import { CourseCategory } from '@prisma/__generated__'
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class UpdateTeacherDto {
	@ApiProperty({
		example: 'Иван',
		description: 'Имя преподавателя',
		required: false,
	})
	@IsString({ message: 'Имя должно быть строкой' })
	@IsOptional()
	public name?: string

	@ApiProperty({
		example: 'Иванов',
		description: 'Фамилия преподавателя',
		required: false,
	})
	@IsString({ message: 'Фамилия должна быть строкой' })
	@IsOptional()
	public surname?: string

	@ApiProperty({
		example: 'Иванович',
		description: 'Отчество преподавателя',
		required: false,
	})
	@IsString({ message: 'Отчество должно быть строкой' })
	@IsOptional()
	public patronymic?: string

	@ApiProperty({
		example: 'EGE',
		description: 'Категория преподавателя',
		enum: CourseCategory,
		required: false,
	})
	@IsEnum(CourseCategory, {
		message: 'Некорректная категория преподавателя',
	})
	@IsOptional()
	public category?: CourseCategory

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
		required: false,
	})
	@IsString({ message: 'Опыт работы должен быть строкой' })
	@IsOptional()
	public experience?: string

	@ApiProperty({
		example: 95,
		description: 'Балл ЕГЭ преподавателя (от 0 до 100)',
		minimum: 0,
		maximum: 100,
		required: false,
	})
	@IsInt({ message: 'Балл ЕГЭ должен быть целым числом' })
	@Min(0, { message: 'Балл ЕГЭ не может быть меньше 0' })
	@Max(100, { message: 'Балл ЕГЭ не может быть больше 100' })
	@IsOptional()
	public egeScore?: number

	@ApiProperty({
		example: 'Математика',
		description: 'Направление подготовки преподавателя',
		required: false,
	})
	@IsString({ message: 'Направление должно быть строкой' })
	@IsOptional()
	public direction?: string
}
