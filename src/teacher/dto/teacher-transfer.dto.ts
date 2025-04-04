import { ApiProperty } from '@nestjs/swagger'

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
