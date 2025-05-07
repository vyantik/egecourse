import { IsNotEmpty, IsString, IsUrl, MinLength } from 'class-validator'

export class CreateUrlContainerDto {
	@IsString({ message: 'URL должен быть строкой' })
	@IsNotEmpty({ message: 'URL обязателен' })
	@IsUrl({ protocols: ['http', 'https'] })
	url: string

	@IsString({ message: 'Ключ должен быть строкой' })
	@IsNotEmpty({ message: 'Ключ обязателен' })
	@MinLength(2, { message: 'Ключ должен быть не менее 2 символов' })
	key: string
}

export class UpdateUrlContainerDto {
	@IsString({ message: 'URL должен быть строкой' })
	@IsNotEmpty({ message: 'URL обязателен' })
	@IsUrl({ protocols: ['http', 'https'] })
	url: string
}
