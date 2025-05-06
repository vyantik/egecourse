import { ApiProperty } from '@nestjs/swagger'

import { UserResponseEntity } from '@/core/user/entities/user-response.entity'

export class AuthResponseEntity {
	@ApiProperty({
		description: 'Информация о пользователе',
		type: UserResponseEntity,
	})
	user: UserResponseEntity

	constructor(partial: Partial<AuthResponseEntity>) {
		Object.assign(this, partial)
	}
}
