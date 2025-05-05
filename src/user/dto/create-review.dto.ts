import { ApiProperty } from '@nestjs/swagger'
import { ReviewCategory } from '@prisma/__generated__'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateReviewDto {
	@ApiProperty({
		description: 'Текст отзыва',
		example: 'Отличный курс, я многому научился!',
	})
	@IsString({ message: 'Текст отзыва должен быть строкой' })
	@IsNotEmpty({ message: 'Текст отзыва обязателен' })
	text: string

	@ApiProperty({
		description: 'Категория отзыва',
		example: 'EXAM',
	})
	@IsEnum(ReviewCategory, {
		message:
			'Категория отзыва должна быть одной из следующих: EXAM, EDUCATION, RAINBOW',
	})
	category: ReviewCategory
}
