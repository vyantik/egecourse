import { ApiProperty } from '@nestjs/swagger'
import { WebinarStatus } from '@prisma/__generated__'

export class Webinar {
	@ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
	id: string

	@ApiProperty({ example: 'Вебинар по React' })
	title: string

	@ApiProperty({ example: 'Описание вебинара' })
	description: string

	@ApiProperty({ enum: WebinarStatus, example: WebinarStatus.OPEN })
	status: WebinarStatus

	@ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
	date: Date

	@ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
	createdAt: Date

	@ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
	updatedAt: Date
}
