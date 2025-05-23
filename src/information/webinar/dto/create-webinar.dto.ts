import { ApiProperty } from '@nestjs/swagger'
import { WebinarStatus } from '@prisma/__generated__/client'
import { Transform } from 'class-transformer'
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateWebinarDto {
	@ApiProperty({
		description: 'Название вебинара',
		example: 'Вебинар по React',
	})
	@IsString()
	@IsNotEmpty()
	title: string

	@ApiProperty({
		description: 'Описание вебинара',
		example: 'Описание вебинара',
	})
	@IsString()
	@IsNotEmpty()
	description: string

	@ApiProperty({
		description: 'Дата и время вебинара',
		example: '2021-01-01T00:00:00.000Z',
	})
	@Transform(({ value }) => new Date(value))
	@IsDate()
	@IsNotEmpty()
	date: Date

	@ApiProperty({
		description: 'Статус вебинара',
		enum: WebinarStatus,
		example: WebinarStatus.OPEN,
	})
	@IsEnum(WebinarStatus)
	@IsNotEmpty()
	status: WebinarStatus
}
