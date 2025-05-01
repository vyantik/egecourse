import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class NewPasswordDto {
	@ApiProperty({
		description: 'Новый пароль (минимум 8 символов)',
		example: 'newPassword123',
		minLength: 8,
		maxLength: 32,
	})
	@IsString({ message: 'Пароль должен быть строкой.' })
	@MinLength(8, { message: 'Пароль должен содержать минимум 8 символов.' })
	@MaxLength(32, { message: 'Пароль должен содержать максимум 32 символа.' })
	@IsNotEmpty({ message: 'Поле нового пароля не может быть пустым.' })
	password: string
}
