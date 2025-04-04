/* eslint-disable prettier/prettier */
import {
	Body,
	Heading,
	Link,
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
	const resetLink = `${domain}/auth/new-password?token=${token}`;

	return (
		<Tailwind>
			<Html>
				<Body className='text-black'>
					<Heading>Reset password</Heading>
					<Text>
                        You have requested a password reset. Please follow the link below to create a new password:
					</Text>
					    <Link href={resetLink}>Confirm password reset</Link>
					<Text>
                        This link is valid for 1 hour. If you did not request a password reset, simply ignore this message.
					</Text>
				</Body>
			</Html>
		</Tailwind>
	);
}