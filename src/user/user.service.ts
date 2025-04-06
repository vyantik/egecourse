import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthMethod } from '@prisma/__generated__'
import { hash } from 'argon2'
import { plainToInstance } from 'class-transformer'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

import { FileSystemService } from '@/file-system/file-system.service'
import { PrismaService } from '@/prisma/prisma.service'

import { UpdateUserDto } from './dto/update-user.dto'
import { UserResponseEntity } from './entities/user-response.entity'

@Injectable()
export class UserService {
	private readonly uploadDir: string
	private readonly avatarsDir: string
	private readonly baseUrl: string

	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly fileService: FileSystemService,
	) {
		this.uploadDir =
			this.configService.get<string>('UPLOAD_DIR') || 'uploads'
		this.avatarsDir = join(this.uploadDir, 'avatars')
		this.baseUrl = this.configService.get<string>('APPLICATION_URL')

		if (!existsSync(this.avatarsDir)) {
			mkdirSync(this.avatarsDir, { recursive: true })
		}
	}

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

	public async updateAvatar(userId: string, file: Express.Multer.File) {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		if (user.picture) {
			await this.fileService.deletePicture(
				this.avatarsDir,
				user.picture.split('/').pop(),
			)
		}

		const picture = await this.fileService.uploadPicture(
			file,
			this.avatarsDir,
		)

		const url = `${this.baseUrl}/users/${user.id}/picture/${picture}`

		const updatedUser = await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				picture: url,
			},
		})

		return plainToInstance(UserResponseEntity, updatedUser, {
			excludeExtraneousValues: false,
		})
	}

	public async getAvatar(
		userId: string,
		pictureName: string,
	): Promise<Buffer> {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		if (!user.picture) {
			throw new NotFoundException('Avatar not found')
		}

		return this.fileService.getPicture(this.avatarsDir, pictureName)
	}
}
