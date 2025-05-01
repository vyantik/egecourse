import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import * as sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

import { PrismaService } from '@/prisma/prisma.service'

import * as fs from 'fs/promises'

/**
 * Сервис для управления файловой системой
 * Предоставляет методы для загрузки, получения и удаления изображений,
 * а также управления аватарами пользователей
 */
@Injectable()
export class FileSystemService {
	/**
	 * Конфигурационные параметры для работы с файлами
	 * @private
	 */
	private readonly uploadDir: string
	private readonly avatarDir: string
	/** Максимальный размер файла (5MB) */
	private readonly maxFileSize: number = 5 * 1024 * 1024
	/** Разрешенные типы MIME для изображений */
	private readonly allowedMimeTypes: string[] = [
		'image/jpeg',
		'image/png',
		'image/webp',
	]

	/**
	 * Конструктор сервиса файловой системы
	 * @param configService - Сервис конфигурации
	 * @param prismaService - Сервис для работы с базой данных
	 */
	constructor(
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
	) {
		this.uploadDir =
			this.configService.get<string>('UPLOAD_DIR') || 'uploads'

		if (!existsSync(this.uploadDir)) {
			mkdirSync(this.uploadDir, { recursive: true })
		}
	}

	/**
	 * Загружает и обрабатывает изображение
	 * @param file - Загруженный файл
	 * @param pictureDir - Директория для сохранения изображения
	 * @returns Promise с именем сохраненного файла
	 * @throws BadRequestException если файл не соответствует требованиям
	 */
	async uploadPicture(
		file: Express.Multer.File,
		pictureDir: string,
	): Promise<string> {
		this.validateFile(file)

		const filename = uuidv4()
		const extension = 'webp'
		const fullFilename = `${filename}.${extension}`
		const filePath = join(pictureDir, fullFilename)

		await this.processAndSaveImage(file.buffer, filePath)

		return `${filename}.${extension}`
	}

	/**
	 * Получает изображение из файловой системы
	 * @param pictureDir - Директория с изображением
	 * @param filename - Имя файла
	 * @returns Promise с буфером изображения
	 * @throws NotFoundException если файл не найден
	 */
	async getPicture(pictureDir: string, filename: string): Promise<Buffer> {
		const filePath = join(pictureDir, filename)

		try {
			return await fs.readFile(filePath)
		} catch (error) {
			throw new NotFoundException('Изображение не найдено')
		}
	}

	/**
	 * Удаляет изображение из файловой системы
	 * @param path - Путь к директории с изображением
	 * @param filename - Имя файла
	 */
	async deletePicture(path: string, filename: string): Promise<void> {
		const filePath = join(path, filename)

		try {
			await fs.unlink(filePath)
		} catch (error) {
			if (error.code !== 'ENOENT') {
				throw error
			}
		}
	}

	/**
	 * Удаляет файл аватара из файловой системы
	 * @param filename - Имя файла аватара
	 * @private
	 */
	private async deleteAvatarFile(filename: string): Promise<void> {
		const filePath = join(this.avatarDir, filename)

		try {
			await fs.unlink(filePath)
		} catch (error) {
			if (error.code !== 'ENOENT') {
				throw error
			}
		}
	}

	/**
	 * Удаляет аватар пользователя
	 * @param userId - ID пользователя
	 * @throws NotFoundException если пользователь не найден
	 */
	async removeUserAvatar(userId: string): Promise<void> {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		})

		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		if (user.picture) {
			const filename = user.picture.split('/').pop()
			if (filename) {
				await this.deleteAvatarFile(filename)
			}

			await this.prismaService.user.update({
				where: { id: userId },
				data: { picture: null },
			})
		}
	}

	/**
	 * Обрабатывает и сохраняет изображение
	 * Изменяет размер до 300x300 и конвертирует в формат WebP
	 * @param buffer - Буфер с исходным изображением
	 * @param outputPath - Путь для сохранения обработанного изображения
	 * @private
	 */
	private async processAndSaveImage(
		buffer: Buffer,
		outputPath: string,
	): Promise<void> {
		await sharp(buffer)
			.resize({
				width: 300,
				height: 300,
				fit: 'cover',
				position: 'center',
			})
			.toFormat('webp', { quality: 80 })
			.toFile(outputPath)
	}

	/**
	 * Проверяет загруженный файл на соответствие требованиям
	 * @param file - Загруженный файл
	 * @throws BadRequestException если файл не соответствует требованиям
	 * @private
	 */
	private validateFile(file: Express.Multer.File): void {
		if (!file) {
			throw new BadRequestException('Файл не загружен')
		}

		if (file.size > this.maxFileSize) {
			throw new BadRequestException(
				`Размер файла превышает лимит в ${this.maxFileSize / (1024 * 1024)}МБ`,
			)
		}

		if (!this.allowedMimeTypes.includes(file.mimetype)) {
			throw new BadRequestException(
				`Неверный тип файла. Разрешенные типы: ${this.allowedMimeTypes.join(', ')}`,
			)
		}
	}

	/**
	 * Получает расширение файла по его MIME-типу
	 * @param mimetype - MIME-тип файла
	 * @returns Расширение файла
	 * @private
	 */
	private getExtension(mimetype: string): string {
		const extensions = {
			'image/jpeg': 'jpg',
			'image/png': 'png',
			'image/webp': 'webp',
		}

		return extensions[mimetype] || 'webp'
	}
}
