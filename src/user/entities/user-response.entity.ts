import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__'
import { Exclude } from 'class-transformer'

export class UserResponseEntity {
	@ApiProperty({
		description: 'Уникальный идентификатор пользователя',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	id: string

	@ApiProperty({
		description: 'Email адрес пользователя',
		example: 'user@example.com',
	})
	email: string

	@Exclude()
	password: string

	@ApiProperty({
		description: 'Имя пользователя',
		example: 'Иван',
	})
	name: string

	@ApiProperty({
		description: 'Фамилия пользователя',
		example: 'Иванов',
	})
	surname: string

	@ApiProperty({
		description: 'Отчество пользователя',
		example: 'Иванович',
	})
	patronymic: string

	@ApiProperty({
		description: 'URL изображения профиля пользователя',
		example: 'https://example.com/avatar.jpg',
		required: false,
		nullable: true,
	})
	picture?: string

	@ApiProperty({
		description: 'Роль пользователя в системе',
		enum: UserRole,
		example: UserRole.REGULAR,
	})
	role: UserRole

	@ApiProperty({
		description: 'Статус верификации email',
		example: true,
	})
	isVerified: boolean

	@ApiProperty({
		description: 'Статус двухфакторной аутентификации',
		example: false,
	})
	isTwoFactorEnabled: boolean

	constructor(partial: Partial<UserResponseEntity>) {
		Object.assign(this, partial)
	}
}
