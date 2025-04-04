import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class NewPasswordDto {
	@ApiProperty({
		description: 'New password (minimum 8 characters)',
		example: 'newPassword123',
		minLength: 8,
		maxLength: 32,
	})
	@IsString({ message: 'Password must be a string.' })
	@MinLength(8, { message: 'Password must be at least 8 characters long.' })
	@MaxLength(32, { message: 'Password must be at most 32 characters.' })
	@IsNotEmpty({ message: 'New password field cannot be empty.' })
	password: string
}
