import {
	Body,
	Container,
	Heading,
	Link,
	Section,
	Tailwind,
	Text,
} from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface ConfirmationTemplateProps {
	domain: string
	token: string
}

export function ConfirmationTemplate({
	domain,
	token,
}: ConfirmationTemplateProps) {
	return React.createElement(
		Tailwind,
		null,
		React.createElement(
			Html,
			null,
			React.createElement(
				Body,
				{ className: 'bg-gray-50' },
				React.createElement(
					Container,
					{ className: 'max-w-xl mx-auto py-8' },
					React.createElement(
						Section,
						{
							className:
								'bg-white p-6 rounded-lg shadow-md border border-gray-200',
						},
						[
							React.createElement(
								Heading,
								{
									className:
										'text-2xl font-bold text-blue-600 mb-4',
									key: 'heading',
								},
								'Добро пожаловать в Центр дополнительного образования ЮФУ!',
							),
							React.createElement(
								Text,
								{
									className: 'text-gray-700 mb-4',
									key: 'text1',
								},
								'Благодарим за регистрацию на сайте.',
							),
							React.createElement(
								Text,
								{
									className: 'text-gray-700 mb-4',
									key: 'text2',
								},
								'Для активации Вашего аккаунта и доступа к курсам, пожалуйста, подтвердите Ваш E-mail:',
							),
							React.createElement(
								Link,
								{
									href: `${domain}/auth/email-confirmation/${token}`,
									className:
										'bg-blue-600 text-white py-3 px-6 rounded-md font-medium inline-block hover:bg-blue-700 transition-colors',
									key: 'link',
								},
								'Подтвердить E-mail',
							),
							React.createElement(
								Text,
								{
									className: 'text-sm text-gray-500 mt-6',
									key: 'text3',
								},
								'Если Вы не регистрировались на нашем сайте, проигнорируйте это письмо.',
							),
						],
					),
				),
			),
		),
	)
}
