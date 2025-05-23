import { ApiProperty } from '@nestjs/swagger'
import { CourseCategory } from '@prisma/__generated__'
import { Transform } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator'

export class GetTeachersQueryDto {
	@ApiProperty({
		required: false,
		description: 'Номер страницы (начиная с 1)',
		example: 1,
	})
	@IsOptional()
	@IsNumber()
	@Min(1)
	@Transform(({ value }) => Number(value))
	public page?: number

	@ApiProperty({
		required: false,
		description: 'Количество элементов на странице',
		example: 10,
	})
	@IsOptional()
	@IsNumber()
	@Min(1)
	@Transform(({ value }) => Number(value))
	public limit?: number

	@ApiProperty({
		required: false,
		description: 'Категория преподавателя',
		enum: CourseCategory,
		example: CourseCategory.EXAM,
		type: () => CourseCategory,
	})
	@IsOptional()
	@IsEnum(CourseCategory, {
		message: 'Некорректная категория преподавателя',
	})
	@Transform(({ value }) => value?.toUpperCase())
	public category?: CourseCategory
}
