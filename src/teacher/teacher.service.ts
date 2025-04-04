import { Injectable, NotFoundException } from '@nestjs/common'
import { Teacher } from '@prisma/__generated__'

import { Meta } from '@/libs/common/utils/meta'
import { PrismaService } from '@/prisma/prisma.service'

import { TeacherDto } from './dto/teacher.dto'
import {
	UpdateFullTeacherDto,
	UpdateTeacherDto,
} from './dto/update-teacher.dto'

@Injectable()
export class TeacherService {
	constructor(private readonly prismaService: PrismaService) {}

	async createTeacher(dto: TeacherDto): Promise<Teacher> {
		return this.prismaService.teacher.create({
			data: {
				...dto,
			},
		})
	}

	async getTeachers(
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

	async getTeacherById(id: string): Promise<Teacher> {
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

	async updateTeacher(id: string, dto: UpdateTeacherDto): Promise<Teacher> {
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

	async replaceTeacher(
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
}
