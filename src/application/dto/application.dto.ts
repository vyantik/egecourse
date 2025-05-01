import { ApiProperty } from '@nestjs/swagger'
import { ApplicationCategory } from '@prisma/__generated__'
import {
	IsEnum,
	IsNotEmpty,
	IsPhoneNumber,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator'

export class ApplicationDto {
	@ApiProperty({
		description: 'Имя заявителя',
		example: 'Иван Иванов Иванович',
	})
	@IsNotEmpty({ message: 'Имя заявителя обязательно' })
	@IsString({ message: 'Имя заявителя должно быть строкой' })
	@MinLength(2, { message: 'Имя заявителя должно быть не менее 2 символов' })
	@MaxLength(100, {
		message: 'Имя заявителя должно быть не более 100 символов',
	})
	name: string

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
	})
	@IsNotEmpty({ message: 'Категория заявки обязательна' })
	@IsEnum(ApplicationCategory)
	category: ApplicationCategory
}
