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

interface ResetPasswordTemplateProps {
	domain: string
	token: string
}

export function ResetPasswordTemplate({
	domain,
	token,
}: ResetPasswordTemplateProps) {
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
								'Сброс пароля',
							),
							React.createElement(
								Text,
								{
									className: 'text-gray-700 mb-4',
									key: 'text1',
								},
								'Вы запросили сброс пароля для вашего аккаунта.',
							),
							React.createElement(
								Text,
								{
									className: 'text-gray-700 mb-4',
									key: 'text2',
								},
								'Для создания нового пароля, пожалуйста, перейдите по ссылке ниже:',
							),
							React.createElement(
								Link,
								{
									href: `${domain}/auth/reset-password/${token}`,
									className:
										'bg-blue-600 text-white py-3 px-6 rounded-md font-medium inline-block hover:bg-blue-700 transition-colors',
									key: 'link',
								},
								'Сбросить пароль',
							),
							React.createElement(
								Text,
								{
									className: 'text-sm text-gray-500 mt-6',
									key: 'text3',
								},
								'Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.',
							),
						],
					),
				),
			),
		),
	)
}
