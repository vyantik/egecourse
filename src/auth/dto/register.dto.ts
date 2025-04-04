import { ApiProperty } from '@nestjs/swagger'
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
	MinLength,
	Validate,
} from 'class-validator'

import { IsPasswordsMatchingConstraint } from '@/libs/common/decorators/is-passwords-matching-constraint.decorator'

export class RegisterDto {
	@ApiProperty({
		description: 'User first name',
		example: 'Иван',
	})
	@IsString({ message: 'First name must be a string.' })
	@IsNotEmpty({ message: 'First name is required.' })
	@Matches(/^[А-ЯЁ][а-яё]*$/, {
		message: 'Name must contains only russian letters.',
	})
	name: string

	@ApiProperty({
		description: 'User last name',
		example: 'Иванов',
	})
	@IsString({ message: 'Last name must be a string.' })
	@IsNotEmpty({ message: 'Last name is required.' })
	@Matches(/^[А-ЯЁ][а-яё]*$/, {
		message: 'Name must contains only russian letters.',
	})
	surname: string

	@ApiProperty({
		description: 'User patronymic (middle name)',
		example: 'Иванович',
	})
	@IsString({ message: 'Patronymic must be a string.' })
	@IsNotEmpty({ message: 'Patronymic is required.' })
	@Matches(/^[А-ЯЁ][а-яё]*$/, {
		message: 'Name must contains only russian letters.',
	})
	patronymic: string

	@ApiProperty({
		description: 'User email address',
		example: 'john.doe@example.com',
	})
	@IsString({ message: 'Email must be a string.' })
	@IsEmail({}, { message: 'Invalid email format.' })
	@IsNotEmpty({ message: 'Email is required.' })
	email: string

	@ApiProperty({
		description: 'User password (minimum 8 characters)',
		example: 'passwordD123',
		minLength: 8,
		maxLength: 32,
	})
	@IsString({ message: 'Password must be a string.' })
	@IsNotEmpty({ message: 'Password is required.' })
	@MinLength(8, { message: 'Password must be at least 8 characters.' })
	@MaxLength(32, { message: 'Password must be at most 32 characters.' })
	@Matches(
		/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+-=[\]{};':"\\|,.<>\/?~]).*$/,
		{
			message:
				'Password must contain one uppercase letter, one number, and one special character.',
		},
	)
	password: string

	@ApiProperty({
		description: 'Password confirmation (must match password)',
		example: 'passwordD123',
	})
	@IsString({ message: 'Password must be a string.' })
	@IsNotEmpty({ message: 'Password is required.' })
	@MinLength(8, { message: 'Password must be at least 8 characters.' })
	@Validate(IsPasswordsMatchingConstraint, {
		message: 'Passwords do not match.',
	})
	passwordRepeat: string
}
