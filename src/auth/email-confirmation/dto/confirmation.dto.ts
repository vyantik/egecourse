import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ConfirmationDto {
	@ApiProperty({
		description: 'Verification token',
		example: '123e4567-e89b-12d3-a456-426614174000',
		required: true,
	})
	@IsString({ message: 'Token must be a string.' })
	@IsNotEmpty({ message: 'Token field cannot be empty.' })
	token: string
}
