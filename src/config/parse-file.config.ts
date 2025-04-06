import { FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common'

export const parseFileConfig = {
	validators: [
		new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
		new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
	],
}
