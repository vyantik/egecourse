import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthMethod } from '@prisma/__generated__'
import { hash } from 'argon2'
import { plainToInstance } from 'class-transformer'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

import { FileSystemService } from '@/file-system/file-system.service'
import { PrismaService } from '@/prisma/prisma.service'

import { ReviewResponseEntity } from '../../information/review/entities/review-response.entity'

import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserResponseEntity } from './entities/user-response.entity'

@Injectable()
export class UserService {
	/**
	 * Директории для загрузки файлов и конфигурационные параметры
	 * @private
	 */
	private readonly uploadDir: string
	private readonly avatarsDir: string
	private readonly baseUrl: string

	/**
	 * Конструктор сервиса пользователей
	 * @param prismaService - Сервис для работы с базой данных
	 * @param configService - Сервис конфигурации
	 * @param fileService - Сервис для работы с файловой системой
	 */
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

	/**
	 * Находит пользователя по ID
	 * @param id - ID пользователя
	 * @returns Promise с найденным пользователем
	 * @throws NotFoundException если пользователь не найден
	 */
	public async findById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: { id },
		})

		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		return plainToInstance(UserResponseEntity, user, {
			excludeExtraneousValues: false,
		})
	}

	/**
	 * Находит пользователя по email
	 * @param email - Email адрес пользователя
	 * @returns Promise с найденным пользователем или null
	 */
	public async findByEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: { email },
		})

		return user
	}

	/**
	 * Создает нового пользователя
	 * @param email - Email адрес пользователя
	 * @param password - Пароль пользователя (будет захэширован)
	 * @param name - Имя пользователя
	 * @param surname - Фамилия пользователя
	 * @param patronymic - Отчество пользователя
	 * @param picture - URL изображения профиля
	 * @param method - Метод аутентификации
	 * @param isVerified - Статус верификации
	 * @returns Promise с созданным пользователем
	 */
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

	/**
	 * Обновляет данные пользователя
	 * @param userId - ID пользователя
	 * @param dto - DTO с обновленными данными
	 * @returns Promise с обновленным пользователем
	 * @throws NotFoundException если пользователь не найден
	 */
	public async update(userId: string, dto: UpdateUserDto) {
		if (Object.values(dto).every(value => value === null)) {
			throw new BadRequestException(
				'Необходимо указать хотя бы одно поле для обновления',
			)
		}

		const user = await this.findById(userId)

		const updatedUser = await this.prismaService.user.update({
			where: {
				id: user.id,
			},
			data: {
				...dto,
			},
		})

		return updatedUser
	}

	/**
	 * Обновляет аватар пользователя
	 * @param userId - ID пользователя
	 * @param file - Загруженный файл изображения
	 * @returns Promise с обновленным пользователем
	 * @throws NotFoundException если пользователь не найден
	 */
	public async updateAvatar(userId: string, file: Express.Multer.File) {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		})

		if (!user) {
			throw new NotFoundException('Пользователь не найден')
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

	/**
	 * Получает аватар пользователя
	 * @param userId - ID пользователя
	 * @param pictureName - Имя файла изображения
	 * @returns Promise с буфером изображения
	 * @throws NotFoundException если пользователь или аватар не найден
	 */
	public async getAvatar(
		userId: string,
		pictureName: string,
	): Promise<Buffer> {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		})

		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		if (!user.picture) {
			throw new NotFoundException('Аватар не найден')
		}

		return this.fileService.getPicture(this.avatarsDir, pictureName)
	}

	/**
	 * Создает новый отзыв от пользователя
	 * @param userId - ID пользователя
	 * @param dto - DTO с данными отзыва
	 * @returns Promise с созданным отзывом
	 * @throws NotFoundException если пользователь не найден
	 */
	public async createReview(userId: string, dto: CreateReviewDto) {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		})

		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		const review = await this.prismaService.review.create({
			data: {
				text: dto.text,
				category: dto.category,
				userId,
			},
			include: {
				user: true,
			},
		})

		return plainToInstance(ReviewResponseEntity, review, {
			excludeExtraneousValues: false,
		})
	}
}
