import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Админка')
@Controller('admin')
export class AdminController {
	constructor() {}
}
