import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateUserDto {
	@ApiProperty({
		description: 'Имя пользователя',
		example: 'Иван',
	})
	@IsString({ message: 'Имя должно быть строкой' })
	@IsOptional()
	name: string

	@ApiProperty({
		description: 'Фамилия пользователя',
		example: 'Иванов',
	})
	@IsString({ message: 'Фамилия должна быть строкой' })
	@IsOptional()
	surname: string

	@ApiProperty({
		description: 'Отчество пользователя',
		example: 'Иванович',
	})
	@IsString({ message: 'Отчество должно быть строкой' })
	@IsOptional()
	patronymic: string
}
