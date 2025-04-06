import { Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class TransformTeacherDtoPipe implements PipeTransform {
	transform(value: any) {
		if (value && typeof value === 'object') {
			if ('egeScore' in value && typeof value.egeScore === 'string') {
				value.egeScore = Number(value.egeScore)
			}
		}
		return value
	}
}
