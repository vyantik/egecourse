import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator'

import { PriceOptionDto } from './course.dto'

export class UpdateCourseDto {
	@ApiProperty({
		example: 'Mathematics for EGE',
		description: 'Name of the course',
		required: false,
	})
	@IsString({ message: 'Name must be a string' })
	@IsOptional()
	name?: string

	@ApiProperty({
		example: 'Comprehensive course covering all EGE mathematics topics',
		description: 'Detailed description of the course',
		required: false,
	})
	@IsString({ message: 'Description must be a string' })
	@IsOptional()
	description?: string

	@ApiProperty({
		example: 'Online',
		description: 'Format of study (Online, Offline, Hybrid)',
		required: false,
	})
	@IsString({ message: 'Study format must be a string' })
	@IsOptional()
	studyFormat?: string

	@ApiProperty({
		example: 'Certificate of completion',
		description: 'Document provided upon completion',
		required: false,
	})
	@IsString({ message: 'Document must be a string' })
	@IsOptional()
	document?: string

	@ApiProperty({
		example: 'September 2023',
		description: 'When the course starts',
		required: false,
	})
	@IsString({ message: 'Study start must be a string' })
	@IsOptional()
	studyStart?: string

	@ApiProperty({
		type: [PriceOptionDto],
		description: 'Available price options with different study durations',
		example: [
			{ studyTime: '3 months', price: '10000' },
			{ studyTime: '6 months', price: '18000' },
		],
		required: false,
	})
	@IsArray({ message: 'Price options must be an array' })
	@ValidateNested({ each: true })
	@Type(() => PriceOptionDto)
	@IsOptional()
	priceOptions?: PriceOptionDto[]
}
