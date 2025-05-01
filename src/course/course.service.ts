import { Injectable, NotFoundException } from '@nestjs/common'
import { Course } from '@prisma/__generated__'

import { Meta } from '@/libs/common/utils/meta'
import { PrismaService } from '@/prisma/prisma.service'

import { CourseDto } from './dto/course.dto'
import { UpdateCourseDto } from './dto/update-course.dto'

@Injectable()
export class CourseService {
	constructor(private readonly prismaService: PrismaService) {}

	public async createCourse(dto: CourseDto): Promise<Course> {
		const { priceOptions, ...courseData } = dto

		return this.prismaService.course.create({
			data: {
				...courseData,
				priceOptions: priceOptions
					? JSON.parse(JSON.stringify(priceOptions))
					: null,
			},
		})
	}

	public async getCourses(
		page?: number,
		limit?: number,
	): Promise<
		| Course[]
		| {
				data: Course[]
				meta: Meta
		  }
	> {
		if (!page || !limit) {
			return this.prismaService.course.findMany({
				orderBy: {
					createdAt: 'desc',
				},
			})
		}

		const skip = (page - 1) * limit

		const [courses, total] = await Promise.all([
			this.prismaService.course.findMany({
				skip,
				take: limit,
				orderBy: {
					createdAt: 'desc',
				},
			}),
			this.prismaService.course.count(),
		])

		return {
			data: courses,
			meta: {
				total,
				page,
				limit,
				lastPage: Math.ceil(total / limit),
			},
		}
	}

	public async getCourseById(id: string): Promise<Course> {
		if (!id) throw new NotFoundException('ID курса обязателен')

		const course = await this.prismaService.course.findUnique({
			where: {
				id,
			},
		})

		if (!course) {
			throw new NotFoundException('Курс не найден')
		}

		return course
	}

	public async updateCourse(
		id: string,
		dto: UpdateCourseDto,
	): Promise<Course> {
		if (!id) throw new NotFoundException('ID курса обязателен')

		const course = await this.prismaService.course.findUnique({
			where: { id },
		})

		if (!course) {
			throw new NotFoundException('Курс не найден')
		}

		const { priceOptions, ...courseData } = dto

		return this.prismaService.course.update({
			where: { id },
			data: {
				...courseData,
				...(priceOptions && {
					priceOptions: JSON.parse(JSON.stringify(priceOptions)),
				}),
			},
		})
	}

	public async replaceCourse(id: string, dto: CourseDto): Promise<Course> {
		if (!id) throw new NotFoundException('ID курса обязателен')

		const course = await this.prismaService.course.findUnique({
			where: { id },
		})

		if (!course) {
			throw new NotFoundException('Курс не найден')
		}

		const { priceOptions, ...courseData } = dto

		return this.prismaService.course.update({
			where: { id },
			data: {
				...courseData,
				priceOptions: priceOptions
					? JSON.parse(JSON.stringify(priceOptions))
					: null,
			},
		})
	}
}
