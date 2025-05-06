import {
	CanActivate,
	ExecutionContext,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class AuthGuard implements CanActivate {
	public constructor(private readonly prismaService: PrismaService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()

		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException('Не авторизован')
		}
		const user = await this.prismaService.user.findUnique({
			where: { id: request.session.userId },
		})

		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		request.user = user

		return true
	}
}
