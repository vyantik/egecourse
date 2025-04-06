import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Transform, Type } from 'class-transformer'

import { omit } from '@/libs/common/utils/omit'

import { UserResponseEntity } from '../../user/entities/user-response.entity'

export class ReviewResponseEntity {
	@ApiProperty({
		description: 'Unique review identifier',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	id: string

	@ApiProperty({
		description: 'Review text content',
		example: 'Great course, I learned a lot!',
	})
	text: string

	@ApiProperty({
		description: 'User who created the review',
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
