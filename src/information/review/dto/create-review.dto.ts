import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateReviewDto {
	@ApiProperty({
		description: 'Текст отзыва',
		example: 'Отличный курс, я многому научился!',
	})
	@IsString({ message: 'Текст отзыва должен быть строкой' })
	@IsNotEmpty({ message: 'Текст отзыва обязателен' })
	text: string

	@ApiProperty({
		description: 'ID курса',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@IsString({ message: 'ID курса должен быть строкой' })
	@IsNotEmpty({ message: 'ID курса обязателен' })
	courseId: string
}
