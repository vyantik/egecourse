import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Type } from 'class-transformer'

import { UserResponseEntity } from './user-response.entity'

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
		type: UserResponseEntity,
	})
	@Type(() => UserResponseEntity)
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
