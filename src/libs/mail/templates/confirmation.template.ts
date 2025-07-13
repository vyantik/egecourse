import {
	Body,
	Container,
	Heading,
	Link,
	Section,
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
		Html,
		null,
		React.createElement(
			Body,
			{ style: body },
			React.createElement(
				Container,
				{ style: container },
				React.createElement(Section, { style: section }, [
					React.createElement(
						Heading,
						{ style: heading, key: 'heading' },
						'Добро пожаловать в Центр дополнительного образования ЮФУ!',
					),
					React.createElement(
						Text,
						{ style: paragraph, key: 'text1' },
						'Благодарим за регистрацию на сайте.',
					),
					React.createElement(
						Text,
						{ style: paragraph, key: 'text2' },
						'Для активации Вашего аккаунта и доступа к курсам, пожалуйста, подтвердите Ваш E-mail:',
					),
					React.createElement(
						Link,
						{
							href: `${domain}/auth/email-confirmation/${token}`,
							style: button,
							key: 'link',
						},
						'Подтвердить E-mail',
					),
					React.createElement(
						Text,
						{ style: footer, key: 'text3' },
						'Если Вы не регистрировались на нашем сайте, проигнорируйте это письмо.',
					),
				]),
			),
		),
	)
}

const body = {
	backgroundColor: '#f9fafb',
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
	margin: 0,
	padding: 0,
}

const container = {
	maxWidth: '36rem',
	margin: '0 auto',
	padding: '2rem 0',
}

const section = {
	backgroundColor: '#ffffff',
	padding: '1.5rem',
	borderRadius: '0.5rem',
	border: '1px solid #e5e7eb',
}

const heading = {
	fontSize: '1.5rem',
	lineHeight: '2rem',
	fontWeight: '700',
	color: '#2563eb',
	marginBottom: '1rem',
}

const paragraph = {
	color: '#374151',
	fontSize: '14px',
	lineHeight: '24px',
	margin: '16px 0',
}

const button = {
	backgroundColor: '#2563eb',
	color: '#ffffff',
	padding: '12px 24px',
	borderRadius: '0.375rem',
	fontWeight: 500,
	display: 'inline-block',
	textDecoration: 'none',
}

const footer = {
	fontSize: '0.875rem',
	lineHeight: '1.25rem',
	color: '#6b7280',
	marginTop: '1.5rem',
}
