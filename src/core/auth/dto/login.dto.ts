import { ApiProperty } from '@nestjs/swagger'
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator'

export class LoginDto {
	@ApiProperty({
		description: 'Email адрес пользователя',
		example: 'john.doe@example.com',
	})
	@IsString({ message: 'Email должен быть строкой.' })
	@IsEmail({}, { message: 'Неверный формат email.' })
	@IsNotEmpty({ message: 'Email обязателен.' })
	email: string

	@ApiProperty({
		description: 'Пароль пользователя',
		example: 'passwordD123',
	})
	@IsString({ message: 'Пароль должен быть строкой.' })
	@IsNotEmpty({ message: 'Пароль обязателен.' })
	@MinLength(8, { message: 'Пароль должен содержать минимум 8 символов.' })
	@MaxLength(32, { message: 'Пароль должен содержать максимум 32 символа.' })
	password: string

	@ApiProperty({
		description: 'Код двухфакторной аутентификации (если включена)',
		example: '123456',
		required: false,
	})
	@IsOptional()
	@IsString()
	code: string
}
