import { Injectable } from '@nestjs/common'

import { CourseService } from '@/information/course/course.service'
import { CourseDto } from '@/information/course/dto/course.dto'
import { UpdateCourseDto } from '@/information/course/dto/update-course.dto'
import { FaqDto } from '@/information/faq/dto/faq.dto'
import { UpdateFullFaqDto } from '@/information/faq/dto/update-faq.dto'
import { UpdateFaqDto } from '@/information/faq/dto/update-faq.dto'
import { FaqService } from '@/information/faq/faq.service'
import { CreateTeacherDto } from '@/information/teacher/dto/teacher.dto'
import { UpdateTeacherDto } from '@/information/teacher/dto/update-teacher.dto'
import { TeacherService } from '@/information/teacher/teacher.service'
import {
	CreateUrlContainerDto,
	UpdateUrlContainerDto,
} from '@/information/url-container/dto/url-container.dto'
import { UrlContainerService } from '@/information/url-container/url-container.service'
import { CreateWebinarDto } from '@/information/webinar/dto/create-webinar.dto'
import { WebinarService } from '@/information/webinar/webinar.service'
import { UserService } from '@/user/user.service'

@Injectable()
export class AdminService {
	constructor(
		private readonly webinarService: WebinarService,
		private readonly userService: UserService,
		private readonly urlContainerService: UrlContainerService,
		private readonly teacherService: TeacherService,
		private readonly faqService: FaqService,
		private readonly courseService: CourseService,
	) {}

	public async createCourse(dto: CourseDto) {
		return this.courseService.createCourse(dto)
	}

	public async updateCourse(id: string, dto: UpdateCourseDto) {
		return this.courseService.updateCourse(id, dto)
	}

	public async replaceCourse(id: string, dto: CourseDto) {
		return this.courseService.replaceCourse(id, dto)
	}

	public async createFaq(dto: FaqDto) {
		return this.faqService.createFaq(dto)
	}

	public async updateFaq(id: string, dto: UpdateFaqDto) {
		return this.faqService.updateFaq(id, dto)
	}

	public async replaceFaq(id: string, dto: UpdateFullFaqDto) {
		return this.faqService.replaceFaq(id, dto)
	}

	public async createTeacher(
		dto: CreateTeacherDto,
		file?: Express.Multer.File,
	) {
		return this.teacherService.createTeacher(dto, file)
	}

	public async updateTeacher(id: string, dto: UpdateTeacherDto) {
		return this.teacherService.updateTeacher(id, dto)
	}

	public async replaceTeacher(id: string, dto: UpdateTeacherDto) {
		return this.teacherService.replaceTeacher(id, dto)
	}

	public async updateTeacherPicture(
		teacherId: string,
		file: Express.Multer.File,
	) {
		return this.teacherService.updateTeacherPicture(teacherId, file)
	}

	public async deleteTeacherPicture(teacherId: string, picture: string) {
		return this.teacherService.deleteTeacherPicture(teacherId, picture)
	}

	public async deleteTeacher(id: string) {
		return this.teacherService.deleteTeacher(id)
	}

	public async createUrlContainer(dto: CreateUrlContainerDto) {
		return this.urlContainerService.createUrlContainer(dto)
	}

	public async updateUrlContainer(key: string, dto: UpdateUrlContainerDto) {
		return this.urlContainerService.updateUrlContainer(key, dto)
	}

	public async createWebinar(dto: CreateWebinarDto) {
		return this.webinarService.createWebinar(dto)
	}
}
