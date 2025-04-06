import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
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
	@Type(() => Number)
	egeScore: number

	@ApiProperty({
		example: 'Mathematics',
		description: 'Teaching direction/subject',
	})
	@IsString({ message: 'Direction must be a string' })
	@IsNotEmpty({ message: 'Direction is required' })
	direction: string
}
