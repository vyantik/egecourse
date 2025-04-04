import { Injectable, NotFoundException } from '@nestjs/common'
import { AuthMethod } from '@prisma/__generated__'
import { hash } from 'argon2'
import { plainToInstance } from 'class-transformer'

import { PrismaService } from '@/prisma/prisma.service'

import { UpdateUserDto } from './dto/update-user.dto'
import { UserResponseEntity } from './entities/user-response.entity'

@Injectable()
export class UserService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: { id },
		})

		if (!user) {
			throw new NotFoundException('User not found.')
		}

		return plainToInstance(UserResponseEntity, user, {
			excludeExtraneousValues: false,
		})
	}

	public async findByEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: { email },
		})

		return user
	}

	public async create(
		email: string,
		password: string,
		name: string,
		surname: string,
		patronymic: string,
		picture: string,
		method: AuthMethod,
		isVerified: boolean,
	) {
		const user = this.prismaService.user.create({
			data: {
				email,
				password: password ? await hash(password) : '',
				name,
				surname,
				patronymic,
				picture,
				method,
				isVerified,
			},
		})

		return user
	}

	public async update(userId: string, dto: UpdateUserDto) {
		const user = await this.findById(userId)

		const updatedUser = await this.prismaService.user.update({
			where: {
				id: user.id,
			},
			data: {
				email: dto.email,
				isTwoFactorEnabled: dto.isTwoFactorEnabled,
			},
		})

		return updatedUser
	}
}
