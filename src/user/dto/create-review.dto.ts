import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateReviewDto {
	@ApiProperty({
		description: 'Текст отзыва',
		example: 'Отличный курс, я многому научился!',
	})
	@IsString({ message: 'Текст отзыва должен быть строкой.' })
	@IsNotEmpty({ message: 'Текст отзыва обязателен.' })
	text: string
}
