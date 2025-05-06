import { ApiProperty } from '@nestjs/swagger'
import { ReviewCategory } from '@prisma/__generated__'
import { Exclude, Transform, Type } from 'class-transformer'

import { omit } from '@/libs/common/utils/omit'

import { UserResponseEntity } from '../../../core/user/entities/user-response.entity'

export class ReviewResponseEntity {
	@ApiProperty({
		description: 'Уникальный идентификатор отзыва',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	id: string

	@ApiProperty({
		description: 'Текст отзыва',
		example: 'Отличный курс, я многому научился!',
	})
	text: string

	@ApiProperty({
		description: 'Категория отзыва',
		example: 'EXAM',
		enum: ReviewCategory,
	})
	category: ReviewCategory

	@ApiProperty({
		description: 'Пользователь, создавший отзыв',
		type: () => UserResponseEntity,
	})
	@Type(() => UserResponseEntity)
	@Transform(({ value }) => {
		if (value) {
			const rest = omit(value, [
				'method',
				'isTwoFactorEnabled',
				'isVerified',
				'role',
				'email',
			])
			return rest
		}
		return value
	})
	user: UserResponseEntity

	@Exclude()
	userId: string

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date

	constructor(partial: Partial<ReviewResponseEntity>) {
		Object.assign(this, partial)
	}
}
