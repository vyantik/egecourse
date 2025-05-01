import { IsNotEmpty, IsString, IsUrl } from 'class-validator'

export class CreateUrlContainerDto {
	@IsString({ message: 'URL must be a string' })
	@IsNotEmpty({ message: 'URL is required' })
	@IsUrl()
	url: string
}

export class UpdateUrlContainerDto {
	@IsString({ message: 'ID must be a string' })
	@IsNotEmpty({ message: 'ID is required' })
	id: string

	@IsString({ message: 'URL must be a string' })
	@IsNotEmpty({ message: 'URL is required' })
	@IsUrl()
	url: string
}
