import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__'
import { Exclude, Type } from 'class-transformer'

import { CourseResponseEntity } from '@/information/course/entities/course-response.entity'

export class UserResponseCourseEntity {
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

	@ApiProperty({
		description: 'Курс пользователя',
		type: () => CourseResponseEntity,
	})
	@Type(() => CourseResponseEntity)
	course: CourseResponseEntity

	constructor(partial: Partial<UserResponseCourseEntity>) {
		Object.assign(this, partial)
	}
}
