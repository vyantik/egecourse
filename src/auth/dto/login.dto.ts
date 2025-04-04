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
		description: 'User email address',
		example: 'john.doe@example.com',
	})
	@IsString({ message: 'Email must be a string.' })
	@IsEmail({}, { message: 'Invalid email format.' })
	@IsNotEmpty({ message: 'Email is required.' })
	email: string

	@ApiProperty({
		description: 'User password',
		example: 'passwordD123',
	})
	@IsString({ message: 'Password must be a string.' })
	@IsNotEmpty({ message: 'Password is required.' })
	@MinLength(8, { message: 'Password must be at least 8 characters.' })
	@MaxLength(32, { message: 'Password must be at most 32 characters.' })
	password: string

	@ApiProperty({
		description: 'Two-factor authentication code (if enabled)',
		example: '123456',
		required: false,
	})
	@IsOptional()
	@IsString()
	code: string
}
