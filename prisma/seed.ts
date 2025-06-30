import { PrismaClient } from './__generated__'

const prisma = new PrismaClient()

async function main() {
	console.log('Starting database seeding...')

	// Создаем тестового пользователя
	const user = await prisma.user.upsert({
		where: { email: 'admin@example.com' },
		update: {},
		create: {
			email: 'admin@example.com',
			password: '$argon2id$v=19$m=65536,t=3,p=4$dGVzdA$dGVzdA', // test
			name: 'Админ',
			surname: 'Админов',
			patronymic: 'Админович',
			role: 'ADMIN',
			method: 'CREDENTIALS',
			isVerified: true,
		},
	})

	// Создаем тестового преподавателя
	const teacher = await prisma.teacher.upsert({
		where: { id: 'test-teacher-id' },
		update: {},
		create: {
			id: 'test-teacher-id',
			name: 'Иван',
			surname: 'Иванов',
			patronymic: 'Иванович',
			category: 'EXAM',
			experience: '5 лет',
			egeScore: 95,
			direction: 'Математика',
		},
	})

	// Создаем тестовый FAQ
	const faq = await prisma.faq.upsert({
		where: { id: 'test-faq-id' },
		update: {},
		create: {
			id: 'test-faq-id',
			question: 'Как записаться на курс?',
			answer: 'Для записи на курс необходимо заполнить заявку на сайте.',
		},
	})

	// Создаем тестовый курс
	const course = await prisma.course.upsert({
		where: { id: 'test-course-id' },
		update: {},
		create: {
			id: 'test-course-id',
			name: 'Подготовка к ЕГЭ по математике',
			description: 'Комплексная подготовка к ЕГЭ по математике',
			header: 'ЕГЭ Математика',
			studyFormat: 'Онлайн',
			document: 'Сертификат',
			studyStart: 'Сентябрь 2024',
			category: 'EXAM',
			priceOptions: {
				basic: {
					price: 15000,
					features: [
						'Доступ к материалам',
						'Проверка домашних заданий',
					],
					duration: 3,
				},
				premium: {
					price: 25000,
					features: [
						'Доступ к материалам',
						'Проверка домашних заданий',
						'Индивидуальные консультации',
					],
					duration: 6,
				},
			},
		},
	})

	console.log('Database seeded successfully!')
	console.log('Created user:', user.email)
	console.log('Created teacher:', teacher.name)
	console.log('Created FAQ:', faq.question)
	console.log('Created course:', course.name)
}

main()
	.catch(e => {
		console.error('Error seeding database:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
