import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class faqDto {
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

export class FaqTransferDto extends faqDto {
	@ApiProperty({
		example: '550e8400-e29b-41d4-a716-446655440000',
		description: 'Unique identifier',
	})
	id: string

	@ApiProperty({
		example: '2023-01-01T00:00:00.000Z',
		description: 'Creation date',
	})
	createdAt: Date

	@ApiProperty({
		example: '2023-01-01T00:00:00.000Z',
		description: 'Last update date',
	})
	updatedAt: Date
}

export class FaqPaginationResponseDto {
	@ApiProperty({
		type: [FaqTransferDto],
		description: 'Array of FAQ entries',
	})
	data: FaqTransferDto[]

	@ApiProperty({
		type: 'object',
		properties: {
			total: {
				type: 'number',
				example: 100,
				description: 'Total number of FAQ entries',
			},
			page: {
				type: 'number',
				example: 1,
				description: 'Current page number',
			},
			limit: {
				type: 'number',
				example: 10,
				description: 'Number of items per page',
			},
			lastPage: {
				type: 'number',
				example: 10,
				description: 'Last page number',
			},
		},
	})
	meta: {
		total: number
		page: number
		limit: number
		lastPage: number
	}
}
