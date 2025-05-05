import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { AuthMethod, UserRole } from '@prisma/__generated__'
import { Exclude } from 'class-transformer'

export class UserEntity {
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

	@ApiHideProperty()
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
		default: UserRole.REGULAR,
	})
	role: UserRole

	@ApiProperty({
		description: 'Статус верификации email',
		example: true,
		default: false,
	})
	isVerified: boolean

	@ApiProperty({
		description: 'Двухфакторная аутентификация',
		example: false,
		default: false,
	})
	isTwoFactorEnabled: boolean

	@ApiProperty({
		description: 'Метод аутентификации',
		enum: AuthMethod,
		example: AuthMethod.CREDENTIALS,
	})
	method: AuthMethod

	@ApiProperty({
		description: 'Дата создания аккаунта',
		example: '2023-01-01T00:00:00.000Z',
	})
	createdAt: Date

	@ApiProperty({
		description: 'Дата последнего обновления аккаунта',
		example: '2023-01-01T00:00:00.000Z',
	})
	updatedAt: Date

	constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial)
	}
}
