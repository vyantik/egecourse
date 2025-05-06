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
		description: 'Имя пользователя',
		example: 'Иван',
	})
	@IsString({ message: 'Имя должно быть строкой.' })
	@IsNotEmpty({ message: 'Имя обязательно.' })
	@Matches(/^[А-ЯЁ][а-яё]*$/, {
		message: 'Имя должно содержать только русские буквы.',
	})
	name: string

	@ApiProperty({
		description: 'Фамилия пользователя',
		example: 'Иванов',
	})
	@IsString({ message: 'Фамилия должна быть строкой.' })
	@IsNotEmpty({ message: 'Фамилия обязательна.' })
	@Matches(/^[А-ЯЁ][а-яё]*$/, {
		message: 'Фамилия должна содержать только русские буквы.',
	})
	surname: string

	@ApiProperty({
		description: 'Отчество пользователя',
		example: 'Иванович',
	})
	@IsString({ message: 'Отчество должно быть строкой.' })
	@IsNotEmpty({ message: 'Отчество обязательно.' })
	@Matches(/^[А-ЯЁ][а-яё]*$/, {
		message: 'Отчество должно содержать только русские буквы.',
	})
	patronymic: string

	@ApiProperty({
		description: 'Email адрес пользователя',
		example: 'john.doe@example.com',
	})
	@IsString({ message: 'Email должен быть строкой.' })
	@IsEmail({}, { message: 'Неверный формат email.' })
	@IsNotEmpty({ message: 'Email обязателен.' })
	email: string

	@ApiProperty({
		description: 'Пароль пользователя (минимум 8 символов)',
		example: 'passwordD123',
		minLength: 8,
		maxLength: 32,
	})
	@IsString({ message: 'Пароль должен быть строкой.' })
	@IsNotEmpty({ message: 'Пароль обязателен.' })
	@MinLength(8, { message: 'Пароль должен содержать минимум 8 символов.' })
	@MaxLength(32, { message: 'Пароль должен содержать максимум 32 символа.' })
	@Matches(
		/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+-=[\]{};':"\\|,.<>\/?~]).*$/,
		{
			message:
				'Пароль должен содержать одну заглавную букву, одну цифру и один специальный символ.',
		},
	)
	password: string

	@ApiProperty({
		description: 'Подтверждение пароля (должно совпадать с паролем)',
		example: 'passwordD123',
	})
	@IsString({ message: 'Пароль должен быть строкой.' })
	@IsNotEmpty({ message: 'Пароль обязателен.' })
	@MinLength(8, { message: 'Пароль должен содержать минимум 8 символов.' })
	@Validate(IsPasswordsMatchingConstraint, {
		message: 'Пароли не совпадают.',
	})
	passwordRepeat: string
}
