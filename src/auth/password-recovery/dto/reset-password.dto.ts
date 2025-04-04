import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class ResetPasswordDto {
	@ApiProperty({
		description: 'Email address for password reset',
		example: 'john.doe@example.com',
	})
	@IsEmail({}, { message: 'Please enter a valid email address.' })
	@IsNotEmpty({ message: 'Email field cannot be empty.' })
	email: string
}
