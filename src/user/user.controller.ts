import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { UserRole } from '@prisma/__generated__'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'

import { UpdateUserDto } from './dto/update-user.dto'
import { UserResponseEntity } from './entities/user-response.entity'
import { UserService } from './user.service'

@ApiTags('users')
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({ summary: 'Get current user profile' })
	@ApiResponse({
		status: 200,
		description: 'Returns the current user profile',
		type: UserResponseEntity,
	})
	@ApiBearerAuth()
	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get('profile')
	public async findProfile(@Authorized('id') userId: string) {
		return this.userService.findById(userId)
	}

	@ApiOperation({ summary: 'Get user by ID (Admin only)' })
	@ApiResponse({
		status: 200,
		description: 'Returns the user with the specified ID',
		type: UserResponseEntity,
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden - Insufficient permissions',
	})
	@ApiResponse({ status: 404, description: 'User not found' })
	@ApiBearerAuth()
	@Authorization(UserRole.ADMIN)
	@HttpCode(HttpStatus.OK)
	@Get(':id')
	public async findById(@Param('id') id: string) {
		return this.userService.findById(id)
	}

	@ApiOperation({ summary: 'Update current user profile' })
	@ApiResponse({
		status: 200,
		description: 'User profile updated successfully',
		type: UserResponseEntity,
	})
	@ApiBearerAuth()
	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Patch('profile')
	public async updateProfile(
		@Authorized('id') userId: string,
		@Body() dto: UpdateUserDto,
	) {
		return this.userService.update(userId, dto)
	}
}
