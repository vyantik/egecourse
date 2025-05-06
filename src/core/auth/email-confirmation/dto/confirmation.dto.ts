import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ConfirmationDto {
	@ApiProperty({
		description: 'Токен подтверждения',
		example: '123e4567-e89b-12d3-a456-426614174000',
		required: true,
	})
	@IsString({ message: 'Токен должен быть строкой.' })
	@IsNotEmpty({ message: 'Поле токена не может быть пустым.' })
	token: string
}
