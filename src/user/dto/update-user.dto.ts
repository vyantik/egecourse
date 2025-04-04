import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UpdateUserDto {
	@ApiProperty({
		description: 'User email address',
		example: 'user@example.com',
	})
	@IsString({ message: 'Email must be a string.' })
	@IsEmail({}, { message: 'Invalid email format.' })
	@IsNotEmpty({ message: 'Email is required.' })
	email: string

	@ApiProperty({
		description: 'Two-factor authentication status',
		example: false,
	})
	@IsBoolean({ message: 'isTwoFactorEnabled must be a boolean value.' })
	isTwoFactorEnabled: boolean
}
