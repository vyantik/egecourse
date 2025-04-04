import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

import { TeacherDto } from './dto/teacher.dto'

@Injectable()
export class TeacherService {
	constructor(private readonly prismaService: PrismaService) {}

	async createTeacher(dto: TeacherDto) {
		return this.prismaService.teacher.create({
			data: {
				...dto,
			},
		})
	}

	async getTeachers(page?: number, limit?: number) {
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
}
