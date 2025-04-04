import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__'
import { Exclude } from 'class-transformer'

export class UserResponseEntity {
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
	})
	role: UserRole

	@ApiProperty({
		description: 'Email verification status',
		example: true,
	})
	isVerified: boolean

	@ApiProperty({
		description: 'Two-factor authentication status',
		example: false,
	})
	isTwoFactorEnabled: boolean

	constructor(partial: Partial<UserResponseEntity>) {
		Object.assign(this, partial)
	}
}
