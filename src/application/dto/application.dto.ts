import { ApiProperty } from '@nestjs/swagger'
import { CourseCategory } from '@prisma/__generated__'
import { IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator'

export class ApplicationDto {
	@ApiProperty({
		description: 'Телефон заявителя',
		example: '+79991234567',
	})
	@IsNotEmpty({ message: 'Телефон заявителя обязателен' })
	@IsString({ message: 'Телефон заявителя должен быть строкой' })
	@IsPhoneNumber('RU', {
		message: 'Телефон заявителя должен быть в формате +79991234567',
	})
	phone: string

	@ApiProperty({
		description: 'Категория заявки',
		example: 'EXAM',
		enum: CourseCategory,
	})
	@IsNotEmpty({ message: 'Категория заявки обязательна' })
	@IsEnum(CourseCategory)
	category: CourseCategory

	@ApiProperty({
		description: 'ID курса',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@IsNotEmpty({ message: 'ID курса обязателен' })
	@IsString({ message: 'ID курса должен быть строкой' })
	courseId?: string
}
