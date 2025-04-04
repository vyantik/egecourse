import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator'

class PriceOptionDto {
	@ApiProperty({
		example: '3 months',
		description: 'Duration of the study period',
	})
	@IsString({ message: 'Study time must be a string' })
	@IsNotEmpty({ message: 'Study time is required' })
	studyTime: string

	@ApiProperty({
		example: '10000',
		description: 'Price for the specified study period',
	})
	@IsString({ message: 'Price must be a string' })
	@IsNotEmpty({ message: 'Price is required' })
	price: string
}

export class CourseDto {
	@ApiProperty({
		example: 'Mathematics for EGE',
		description: 'Name of the course',
	})
	@IsString({ message: 'Name must be a string' })
	@IsNotEmpty({ message: 'Name is required' })
	name: string

	@ApiProperty({
		example: 'Comprehensive course covering all EGE mathematics topics',
		description: 'Detailed description of the course',
	})
	@IsString({ message: 'Description must be a string' })
	@IsNotEmpty({ message: 'Description is required' })
	description: string

	@ApiProperty({
		example: 'Online',
		description: 'Format of study (Online, Offline, Hybrid)',
	})
	@IsString({ message: 'Study format must be a string' })
	@IsNotEmpty({ message: 'Study format is required' })
	studyFormat: string

	@ApiProperty({
		example: 'Certificate of completion',
		description: 'Document provided upon completion',
	})
	@IsString({ message: 'Document must be a string' })
	@IsNotEmpty({ message: 'Document is required' })
	document: string

	@ApiProperty({
		example: 'September 2023',
		description: 'When the course starts',
	})
	@IsString({ message: 'Study start must be a string' })
	@IsNotEmpty({ message: 'Study start is required' })
	studyStart: string

	@ApiProperty({
		type: [PriceOptionDto],
		description: 'Available price options with different study durations',
		example: [
			{ studyTime: '3 months', price: '10000' },
			{ studyTime: '6 months', price: '18000' },
		],
	})
	@IsArray({ message: 'Price options must be an array' })
	@ValidateNested({ each: true })
	@Type(() => PriceOptionDto)
	priceOptions: PriceOptionDto[]
}
