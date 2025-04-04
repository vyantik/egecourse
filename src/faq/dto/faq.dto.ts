import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class FaqDto {
	@ApiProperty({
		example: 'How do I reset my password?',
		description: 'The question for the FAQ entry',
	})
	@IsString({ message: 'Question must be a string' })
	@IsNotEmpty({ message: 'Question is required' })
	question: string

	@ApiProperty({
		example:
			'You can reset your password by clicking on the "Forgot Password" link on the login page.',
		description: 'The answer for the FAQ entry',
	})
	@IsString({ message: 'Answer must be a string' })
	@IsNotEmpty({ message: 'Answer is required' })
	answer: string
}
