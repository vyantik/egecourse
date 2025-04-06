import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Teacher } from '@prisma/__generated__'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

import { FileSystemService } from '@/file-system/file-system.service'
import { Meta } from '@/libs/common/utils/meta'
import { PrismaService } from '@/prisma/prisma.service'

import { TeacherDto } from './dto/teacher.dto'
import {
	UpdateFullTeacherDto,
	UpdateTeacherDto,
} from './dto/update-teacher.dto'

@Injectable()
export class TeacherService {
	private readonly uploadDir: string
	private readonly teacherPicturesDir: string
	private readonly baseUrl: string

	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly fileService: FileSystemService,
	) {
		this.uploadDir =
			this.configService.get<string>('UPLOAD_DIR') || 'uploads'
		this.teacherPicturesDir = join(this.uploadDir, 'teacherPictures')
		this.baseUrl = this.configService.get<string>('APPLICATION_URL')

		if (!existsSync(this.teacherPicturesDir)) {
			mkdirSync(this.teacherPicturesDir, { recursive: true })
		}
	}

	public async createTeacher(
		dto: TeacherDto,
		file?: Express.Multer.File,
	): Promise<Teacher> {
		const teacher = await this.prismaService.teacher.create({
			data: {
				name: dto.name,
				surname: dto.surname,
				patronymic: dto.patronymic,
				experience: dto.experience,
				direction: dto.direction,
				egeScore: dto.egeScore,
				picture: '',
			},
		})

		if (file) {
			const picture = await this.fileService.uploadPicture(
				file,
				this.teacherPicturesDir,
			)

			const url = `${this.baseUrl}/teachers/${teacher.id}/picture/${picture}`

			return this.prismaService.teacher.update({
				where: { id: teacher.id },
				data: {
					picture: url,
				},
			})
		}

		return teacher
	}

	public async getTeachers(
		page?: number,
		limit?: number,
	): Promise<Teacher[] | { data: Teacher[]; meta: Meta }> {
		if (!page || !limit) {
			return this.prismaService.teacher.findMany({
				orderBy: {
					createdAt: 'desc',
				},
			})
		}

		const skip = (page - 1) * limit

		const [teachers, total] = await Promise.all([
			this.prismaService.teacher.findMany({
				skip,
				take: limit,
				orderBy: {
					createdAt: 'desc',
				},
			}),
			this.prismaService.teacher.count(),
		])

		return {
			data: teachers,
			meta: {
				total,
				page,
				limit,
				lastPage: Math.ceil(total / limit),
			},
		}
	}

	public async getTeacherById(id: string): Promise<Teacher> {
		if (!id) throw new NotFoundException('id is required')

		const teacher = await this.prismaService.teacher.findUnique({
			where: {
				id,
			},
		})

		if (!teacher) {
			throw new NotFoundException('Teacher not found')
		}

		return teacher
	}

	public async updateTeacher(
		id: string,
		dto: UpdateTeacherDto,
	): Promise<Teacher> {
		if (!id) throw new NotFoundException('id is required')

		const teacher = await this.prismaService.teacher.findUnique({
			where: { id },
		})

		if (!teacher) {
			throw new NotFoundException('Teacher not found')
		}

		const { ...updateData } = dto

		return this.prismaService.teacher.update({
			where: { id },
			data: updateData,
		})
	}

	public async replaceTeacher(
		id: string,
		dto: UpdateFullTeacherDto,
	): Promise<Teacher> {
		if (!id) throw new NotFoundException('id is required')

		const teacher = await this.prismaService.teacher.findUnique({
			where: { id },
		})

		if (!teacher) {
			throw new NotFoundException('Teacher not found')
		}

		return this.prismaService.teacher.update({
			where: { id },
			data: {
				...dto,
				picture: teacher.picture,
			},
		})
	}

	public async updateTeacherPicture(
		teacherId: string,
		file: Express.Multer.File,
	): Promise<Teacher> {
		const teacher = await this.prismaService.teacher.findUnique({
			where: { id: teacherId },
		})

		if (!teacher) {
			throw new NotFoundException('Teacher not found')
		}

		if (teacher.picture) {
			await this.fileService.deletePicture(
				this.teacherPicturesDir,
				teacher.picture.split('/').pop(),
			)
		}

		const picture = await this.fileService.uploadPicture(
			file,
			this.teacherPicturesDir,
		)

		const url = `${this.baseUrl}/teachers/${teacher.id}/picture/${picture}`

		return this.prismaService.teacher.update({
			where: { id: teacher.id },
			data: {
				picture: url,
			},
		})
	}

	public async getPicture(
		teacherId: string,
		pictureName: string,
	): Promise<Buffer> {
		const teacher = await this.prismaService.teacher.findUnique({
			where: { id: teacherId },
		})

		if (!teacher) {
			throw new NotFoundException('Teacher not found')
		}

		if (!teacher.picture) {
			throw new NotFoundException('Teacher picture not found')
		}

		return this.fileService.getPicture(this.teacherPicturesDir, pictureName)
	}

	public async deleteTeacherPicture(
		teacherId: string,
		pictureName: string,
	): Promise<void> {
		const teacher = await this.prismaService.teacher.findUnique({
			where: { id: teacherId },
		})

		if (!teacher) {
			throw new NotFoundException('Teacher not found')
		}

		await this.fileService.deletePicture(
			this.teacherPicturesDir,
			pictureName,
		)

		await this.prismaService.teacher.update({
			where: { id: teacherId },
			data: {
				picture: '',
			},
		})
	}

	public async deleteTeacher(id: string): Promise<void> {
		if (!id) throw new BadRequestException('id is required')

		return this.prismaService.teacher.delete({
			where: { id },
		}) as unknown as void
	}
}
