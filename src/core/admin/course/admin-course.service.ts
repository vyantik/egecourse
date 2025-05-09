import { Injectable } from '@nestjs/common'

import { ApplicationService } from '@/application/application.service'
import { CourseService } from '@/information/course/course.service'
import { CourseDto } from '@/information/course/dto/course.dto'
import { UpdateCourseDto } from '@/information/course/dto/update-course.dto'
import { ReviewService } from '@/information/review/review.service'

@Injectable()
export class AdminCourseService {
	constructor(
		private readonly courseService: CourseService,
		private readonly reviewService: ReviewService,
		private readonly applicationService: ApplicationService,
	) {}

	/**
	 * Создает курс
	 * @param dto - Данные курса
	 */
	public async createCourse(dto: CourseDto) {
		return this.courseService.createCourse(dto)
	}

	/**
	 * Обновляет курс
	 * @param id - ID курса
	 * @param dto - Данные курса
	 */
	public async updateCourse(id: string, dto: UpdateCourseDto) {
		return this.courseService.updateCourse(id, dto)
	}

	/**
	 * Заменяет курс
	 * @param id - ID курса
	 * @param dto - Данные курса
	 */
	public async replaceCourse(id: string, dto: CourseDto) {
		return this.courseService.replaceCourse(id, dto)
	}

	/**
	 * Подписывает пользователя на курс
	 * @param courseId - ID курса
	 * @param userId - ID пользователя
	 */
	public async subscribeToCourse(courseId: string, userId: string) {
		return this.courseService.subscribeToCourse(courseId, userId)
	}

	/**
	 * Удаляет курс по его идентификатору
	 * @param id - ID курса
	 */
	public async deleteCourse(id: string) {
		return this.courseService.deleteCourse(id)
	}

	/**
	 * Одобряет отзыв
	 * @param reviewId - ID отзыва
	 */
	public async approveReview(reviewId: string) {
		return this.reviewService.approveReview(reviewId)
	}

	/**
	 * Отклоняет отзыв
	 * @param reviewId - ID отзыва
	 */
	public async rejectReview(reviewId: string) {
		return this.reviewService.rejectReview(reviewId)
	}

	/**
	 * Получает все заявки
	 */
	public async getApplications() {
		return this.applicationService.getApplications()
	}
}
