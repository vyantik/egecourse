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

@Injectable()
export class FileSystemService {
	private readonly uploadDir: string
	private readonly avatarDir: string
	private readonly maxFileSize: number = 5 * 1024 * 1024
	private readonly allowedMimeTypes: string[] = [
		'image/jpeg',
		'image/png',
		'image/webp',
	]

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

	async getPicture(pictureDir: string, filename: string): Promise<Buffer> {
		const filePath = join(pictureDir, filename)

		try {
			return await fs.readFile(filePath)
		} catch (error) {
			throw new NotFoundException('Picture not found')
		}
	}

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

	async removeUserAvatar(userId: string): Promise<void> {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		})

		if (!user) {
			throw new NotFoundException('User not found')
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

	private validateFile(file: Express.Multer.File): void {
		if (!file) {
			throw new BadRequestException('No file uploaded')
		}

		if (file.size > this.maxFileSize) {
			throw new BadRequestException(
				`File size exceeds the limit of ${this.maxFileSize / (1024 * 1024)}MB`,
			)
		}

		if (!this.allowedMimeTypes.includes(file.mimetype)) {
			throw new BadRequestException(
				`Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
			)
		}
	}

	private getExtension(mimetype: string): string {
		const extensions = {
			'image/jpeg': 'jpg',
			'image/png': 'png',
			'image/webp': 'webp',
		}

		return extensions[mimetype] || 'webp'
	}
}
