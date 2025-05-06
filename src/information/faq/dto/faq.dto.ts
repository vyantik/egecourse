import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class FaqDto {
	@ApiProperty({
		example: 'Как сбросить пароль?',
		description: 'Вопрос для FAQ',
	})
	@IsString({ message: 'Вопрос должен быть строкой' })
	@IsNotEmpty({ message: 'Вопрос обязателен' })
	question: string

	@ApiProperty({
		example:
			'Вы можете сбросить пароль, нажав на ссылку "Забыли пароль" на странице входа.',
		description: 'Ответ на вопрос FAQ',
	})
	@IsString({ message: 'Ответ должен быть строкой' })
	@IsNotEmpty({ message: 'Ответ обязателен' })
	answer: string
}
