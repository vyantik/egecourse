import { ApiProperty } from '@nestjs/swagger'

import { Webinar } from '../entities/webinar.entity'

export class WebinarPaginationResponseDto {
	@ApiProperty({ type: [Webinar] })
	items: Webinar[]

	@ApiProperty({ example: 10 })
	total: number

	@ApiProperty({ example: 1 })
	page: number

	@ApiProperty({ example: 10 })
	limit: number

	@ApiProperty({ example: 1 })
	lastPage: number
}
