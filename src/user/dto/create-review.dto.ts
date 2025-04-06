import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateReviewDto {
	@ApiProperty({
		description: 'Review text content',
		example: 'Great course, I learned a lot!',
	})
	@IsString({ message: 'Review text must be a string.' })
	@IsNotEmpty({ message: 'Review text is required.' })
	text: string
}
