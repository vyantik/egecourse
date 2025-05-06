import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { IsNotEmpty } from 'class-validator'

export class CourseSubscribeDto {
	@ApiProperty({
		description: 'ID пользователя',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@IsString()
	@IsNotEmpty()
	userId: string
}
