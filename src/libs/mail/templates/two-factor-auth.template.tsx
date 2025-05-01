/* eslint-disable prettier/prettier */
import {
	Body,
	Container,
	Heading,
	Section,
	Tailwind,
	Text
} from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

interface TwoFactorAuthTemplateProps {
	token: string;
}

export function TwoFactorAuthTemplate({ token }: TwoFactorAuthTemplateProps) {
	return (
		<Tailwind>
			<Html>
				<Body className="bg-gray-50">
					<Container className="max-w-xl mx-auto py-8">
						<Section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
							<Heading className="text-2xl font-bold text-blue-600 mb-4">
								Подтверждение входа в Образовательный Центр
							</Heading>
							<Text className="text-gray-700 mb-4">
								Для обеспечения безопасности вашего аккаунта требуется дополнительное подтверждение.
							</Text>
							<Section className="bg-gray-100 p-4 rounded-md mb-4">
								<Text className="text-center font-mono text-2xl font-bold text-blue-600">
									{token}
								</Text>
							</Section>
							<Text className="text-gray-700 mb-4">
								Введите этот код на странице входа для получения доступа к вашим учебным материалам.
							</Text>
							<Text className="text-sm text-gray-500 mt-4">
								Код действителен в течение 5 минут.
							</Text>
							<Text className="text-sm text-gray-500 mt-2">
								Если вы не пытались войти в систему, пожалуйста, немедленно смените пароль.
							</Text>
						</Section>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	);
}