import { ApiProperty } from '@nestjs/swagger'
import { ReviewCategory, ReviewStatus } from '@prisma/__generated__'
import { Exclude, Transform, Type } from 'class-transformer'

import { UserResponseEntity } from '@/core/user/entities/user-response.entity'
import { CourseResponseEntity } from '@/information/course/entities/course-response.entity'
import { omit } from '@/libs/common/utils/omit'

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

	@ApiProperty({
		description: 'Курс пользователя',
		type: () => CourseResponseEntity,
	})
	@Type(() => CourseResponseEntity)
	course: CourseResponseEntity

	@ApiProperty({
		description: 'Статус модерации отзыва',
		enum: ReviewStatus,
		example: ReviewStatus.PENDING,
	})
	status: ReviewStatus

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
