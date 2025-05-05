import {
	Body,
	Container,
	Heading,
	Section,
	Tailwind,
	Text,
} from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface TwoFactorAuthTemplateProps {
	token: string
}

export function TwoFactorAuthTemplate({ token }: TwoFactorAuthTemplateProps) {
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
								'Подтверждение входа',
							),
							React.createElement(
								Text,
								{
									className: 'text-gray-700 mb-4',
									key: 'text1',
								},
								'Для подтверждения входа в ваш аккаунт, пожалуйста, используйте следующий код:',
							),
							React.createElement(
								Text,
								{
									className:
										'text-3xl font-bold text-center my-6',
									key: 'token',
								},
								token,
							),
							React.createElement(
								Text,
								{
									className: 'text-sm text-gray-500 mt-6',
									key: 'text2',
								},
								'Если вы не пытались войти в свой аккаунт, немедленно измените пароль и свяжитесь с нами.',
							),
						],
					),
				),
			),
		),
	)
}
