import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class TeacherDto {
	@ApiProperty({
		example: 'John',
		description: 'Teacher first name',
	})
	@IsString({ message: 'Name must be a string' })
	@IsNotEmpty({ message: 'Name is required' })
	name: string

	@ApiProperty({
		example: 'Doe',
		description: 'Teacher last name',
	})
	@IsString({ message: 'Surname must be a string' })
	@IsNotEmpty({ message: 'Surname is required' })
	surname: string

	@ApiProperty({
		example: 'Smith',
		description: 'Teacher patronymic name',
	})
	@IsString({ message: 'Patronymic must be a string' })
	@IsNotEmpty({ message: 'Patronymic is required' })
	patronymic: string

	@ApiProperty({
		example: '10 years',
		description: 'Teaching experience',
	})
	@IsString({ message: 'Experience must be a string' })
	@IsNotEmpty({ message: 'Experience is required' })
	experience: string

	@ApiProperty({
		example: 95,
		description: 'EGE score',
	})
	@IsNumber({}, { message: 'EGE score must be a number' })
	@IsNotEmpty({ message: 'EGE score is required' })
	egeScore: number

	@ApiProperty({
		example: 'Mathematics',
		description: 'Teaching direction/subject',
	})
	@IsString({ message: 'Direction must be a string' })
	@IsNotEmpty({ message: 'Direction is required' })
	direction: string
}

export class TeacherTransferDto {
	@ApiProperty({
		example: '550e8400-e29b-41d4-a716-446655440000',
		description: 'Unique identifier',
	})
	id: string

	@ApiProperty({
		example: 'John',
		description: 'Teacher first name',
	})
	name: string

	@ApiProperty({
		example: 'Doe',
		description: 'Teacher last name',
	})
	surname: string

	@ApiProperty({
		example: 'Smith',
		description: 'Teacher patronymic name',
	})
	patronymic: string

	@ApiProperty({
		example: 'http://example.com/teacher-pictures/teacher-id.webp',
		description: 'URL to teacher picture',
		required: false,
		nullable: true,
	})
	picture: string | null

	@ApiProperty({
		example: '10 years',
		description: 'Teaching experience',
	})
	experience: string

	@ApiProperty({
		example: 95,
		description: 'EGE score',
	})
	egeScore: number

	@ApiProperty({
		example: 'Mathematics',
		description: 'Teaching direction/subject',
	})
	direction: string

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

export class TeacherPaginationResponseDto {
	@ApiProperty({
		type: [TeacherTransferDto],
		description: 'Array of teachers',
	})
	data: TeacherTransferDto[]

	@ApiProperty({
		type: 'object',
		properties: {
			total: {
				type: 'number',
				example: 100,
				description: 'Total number of teachers',
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
