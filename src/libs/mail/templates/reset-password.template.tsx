/* eslint-disable prettier/prettier */
import {
	Body,
	Container,
	Heading,
	Link,
	Section,
	Tailwind,
	Text
} from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

interface ResetPasswordTemplateProps {
	domain: string;
	token: string;
}

export function ResetPasswordTemplate({ domain, token }: ResetPasswordTemplateProps) {
	return (
		<Tailwind>
			<Html>
				<Body className="bg-gray-50">
					<Container className="max-w-xl mx-auto py-8">
						<Section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
							<Heading className="text-2xl font-bold text-blue-600 mb-4">
								Восстановление доступа к учебной платформе
							</Heading>
							<Text className="text-gray-700 mb-4">
								Вы запросили сброс пароля для вашего аккаунта в Образовательном Центре.
							</Text>
							<Text className="text-gray-700 mb-4">
								Для создания нового пароля, пожалуйста, перейдите по ссылке:
							</Text>
							<Link
								href={`${domain}/auth/password-recovery/${token}`}
								className="bg-blue-600 text-white py-3 px-6 rounded-md font-medium inline-block hover:bg-blue-700 transition-colors"
							>
								Сбросить пароль
							</Link>
							<Text className="text-sm text-gray-500 mt-6">
								Если вы не запрашивали сброс пароля, пожалуйста, проигнорируйте это письмо или свяжитесь с нашей службой поддержки.
							</Text>
							<Text className="text-sm text-gray-500 mt-2">
								Ссылка действительна в течение 1 часа.
							</Text>
						</Section>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	);
}