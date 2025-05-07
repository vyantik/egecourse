import { ApiProperty } from '@nestjs/swagger'
import { ReviewStatus } from '@prisma/__generated__'
import { Exclude, Transform, Type } from 'class-transformer'

import { UserResponseCourseEntity } from '@/core/user/entities/user-response-course.entity'
import { CourseResponseEntity } from '@/information/course/entities/course-response.entity'
import { omit } from '@/libs/common/utils/omit'

export class ReviewResponseEntity {
	@ApiProperty({
		description: 'Уникальный идентификатор отзыва',
		example: '5b09501b-b33c-4a93-88b7-810541aa5644',
	})
	id: string

	@ApiProperty({
		description: 'Текст отзыва',
		example: 'Отличный курс, я многому научился!',
	})
	text: string

	@ApiProperty({
		description: 'Статус модерации отзыва',
		enum: ReviewStatus,
		example: ReviewStatus.APPROVED,
	})
	status: ReviewStatus

	@ApiProperty({
		description: 'Пользователь, создавший отзыв',
		type: () => UserResponseCourseEntity,
	})
	@Type(() => UserResponseCourseEntity)
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
	user: UserResponseCourseEntity

	@ApiProperty({
		description: 'Курс, к которому относится отзыв',
		type: () => CourseResponseEntity,
	})
	@Type(() => CourseResponseEntity)
	course: CourseResponseEntity

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
