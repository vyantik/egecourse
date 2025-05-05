import { ApiProperty } from '@nestjs/swagger'
import { ApplicationCategory } from '@prisma/__generated__'
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
		example: 'EXAM_PREPARATION',
		enum: ApplicationCategory,
	})
	@IsNotEmpty({ message: 'Категория заявки обязательна' })
	@IsEnum(ApplicationCategory)
	category: ApplicationCategory
}
