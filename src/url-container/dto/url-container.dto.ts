import { IsNotEmpty, IsString, IsUrl } from 'class-validator'

export class CreateUrlContainerDto {
	@IsString({ message: 'URL должен быть строкой' })
	@IsNotEmpty({ message: 'URL обязателен' })
	@IsUrl()
	url: string
}

export class UpdateUrlContainerDto {
	@IsString({ message: 'Идентификатор должен быть строкой' })
	@IsNotEmpty({ message: 'Идентификатор обязателен' })
	@IsUrl()
	id: string

	@IsString({ message: 'URL должен быть строкой' })
	@IsNotEmpty({ message: 'URL обязателен' })
	@IsUrl()
	url: string
}
