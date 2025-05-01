import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UpdateUserDto {
	@ApiProperty({
		description: 'Email адрес пользователя',
		example: 'user@example.com',
	})
	@IsString({ message: 'Email должен быть строкой' })
	@IsEmail({}, { message: 'Неверный формат email' })
	@IsNotEmpty({ message: 'Email обязателен' })
	email: string

	@ApiProperty({
		description: 'Статус двухфакторной аутентификации',
		example: false,
	})
	@IsBoolean({
		message: 'isTwoFactorEnabled должен быть логическим значением',
	})
	isTwoFactorEnabled: boolean
}
