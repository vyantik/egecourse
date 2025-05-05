import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/__generated__'
import { plainToInstance } from 'class-transformer'
import { Request, Response } from 'express'

import { UserResponseEntity } from '@/user/entities/user-response.entity'

@Injectable()
export class SessionService {
	public constructor(private readonly configService: ConfigService) {}

	public async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id

			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось сохранить сессию',
						),
					)
				}

				const transformedUser = plainToInstance(
					UserResponseEntity,
					user,
					{
						excludeExtraneousValues: false,
					},
				)

				resolve(transformedUser)
			})
		})
	}

	public async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось удалить сессию',
						),
					)
				}

				res.clearCookie(
					this.configService.getOrThrow<string>('SESSION_NAME'),
				)
				resolve()
			})
		})
	}
}
