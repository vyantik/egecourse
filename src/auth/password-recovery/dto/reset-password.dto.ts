import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class ResetPasswordDto {
	@ApiProperty({
		description: 'Email адрес для сброса пароля',
		example: 'john.doe@example.com',
	})
	@IsEmail({}, { message: 'Пожалуйста, введите корректный email адрес.' })
	@IsNotEmpty({ message: 'Поле email не может быть пустым.' })
	email: string
}
