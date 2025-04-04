import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { AuthMethod, UserRole } from '@prisma/__generated__'
import { Exclude } from 'class-transformer'

export class UserEntity {
	@ApiProperty({
		description: 'Unique user identifier',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	id: string

	@ApiProperty({
		description: 'User email address',
		example: 'user@example.com',
	})
	email: string

	@ApiHideProperty()
	@Exclude()
	password: string

	@ApiProperty({
		description: 'User first name',
		example: 'Иван',
	})
	name: string

	@ApiProperty({
		description: 'User last name',
		example: 'Иванов',
	})
	surname: string

	@ApiProperty({
		description: 'User patronymic (middle name)',
		example: 'Иванович',
	})
	patronymic: string

	@ApiProperty({
		description: 'User profile picture URL',
		example: 'https://example.com/avatar.jpg',
		required: false,
		nullable: true,
	})
	picture?: string

	@ApiProperty({
		description: 'User role in the system',
		enum: UserRole,
		example: UserRole.REGULAR,
		default: UserRole.REGULAR,
	})
	role: UserRole

	@ApiProperty({
		description: 'Email verification status',
		example: true,
		default: false,
	})
	isVerified: boolean

	@ApiProperty({
		description: 'Two-factor authentication status',
		example: false,
		default: false,
	})
	isTwoFactorEnabled: boolean

	@ApiProperty({
		description: 'User authentication method',
		enum: AuthMethod,
		example: AuthMethod.CREDENTIALS,
	})
	method: AuthMethod

	@ApiProperty({
		description: 'Account creation date',
		example: '2023-01-01T00:00:00.000Z',
	})
	createdAt: Date

	@ApiProperty({
		description: 'Account last update date',
		example: '2023-01-01T00:00:00.000Z',
	})
	updatedAt: Date

	constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial)
	}
}
