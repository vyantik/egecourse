import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, Matches } from 'class-validator'

export class UpdateUserDto {
	@ApiProperty({
		description: 'Имя пользователя',
		example: 'Иван',
	})
	@IsString({ message: 'Имя должно быть строкой' })
	@Matches(/^[А-ЯЁ][а-яё]*$/, {
		message: 'Имя должно содержать только русские буквы.',
	})
	@IsOptional()
	name: string

	@ApiProperty({
		description: 'Фамилия пользователя',
		example: 'Иванов',
	})
	@IsString({ message: 'Фамилия должна быть строкой' })
	@Matches(/^[А-ЯЁ][а-яё]*$/, {
		message: 'Фамилия должна содержать только русские буквы.',
	})
	@IsOptional()
	surname: string

	@ApiProperty({
		description: 'Отчество пользователя',
		example: 'Иванович',
	})
	@IsString({ message: 'Отчество должно быть строкой' })
	@Matches(/^[А-ЯЁ][а-яё]*$/, {
		message: 'Отчество должно содержать только русские буквы.',
	})
	@IsOptional()
	patronymic: string
}
