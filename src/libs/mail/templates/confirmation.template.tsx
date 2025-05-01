/* eslint-disable prettier/prettier */
import {
	Body,
	Container,
	Heading,
	Link,
	Section,
	Tailwind,
	Text
} from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface ConfirmationTemplateProps {
	domain: string
	token: string
}

export function ConfirmationTemplate({
	domain,
	token
}: ConfirmationTemplateProps) {
	return (
		<Tailwind>
			<Html>
				<Body className="bg-gray-50">
					<Container className="max-w-xl mx-auto py-8">
						<Section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
							<Heading className="text-2xl font-bold text-blue-600 mb-4">
								Добро пожаловать в Образовательный Центр!
							</Heading>
							<Text className="text-gray-700 mb-4">
								Спасибо за регистрацию на нашей платформе подготовки к ЕГЭ и довузовским экзаменам.
							</Text>
							<Text className="text-gray-700 mb-4">
								Для активации вашего аккаунта и доступа к курсам, пожалуйста, подтвердите ваш email:
							</Text>
							<Link
								href={`${domain}/auth/email-confirmation/${token}`}
								className="bg-blue-600 text-white py-3 px-6 rounded-md font-medium inline-block hover:bg-blue-700 transition-colors"
							>
								Подтвердить email
							</Link>
							<Text className="text-sm text-gray-500 mt-6">
								Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.
							</Text>
						</Section>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	)
}