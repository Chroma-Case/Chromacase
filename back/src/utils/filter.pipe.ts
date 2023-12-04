import {
	BadRequestException,
	Injectable,
	PipeTransform,
	Query,
} from "@nestjs/common";

@Injectable()
export class FilterPipe implements PipeTransform {
	constructor(private readonly fields: string[]) {}

	transform(value: Record<string, string>) {
		const filter = {};
		for (const fieldIdentifier of this.fields) {
			const field = fieldIdentifier.startsWith("+")
				? fieldIdentifier.slice(1)
				: fieldIdentifier;

			if (value[field] === undefined) continue;

			if (fieldIdentifier.startsWith("+")) {
				filter[field] = parseInt(value[field]);
				if (isNaN(filter[field]))
					throw new BadRequestException(
						`Invalid filter, ${field} should be a number but it was ${value[field]}.`,
					);
			} else filter[field] = value[field];
		}
		return filter;
	}
}

export function FilterQuery(fields: string[]) {
	return Query(new FilterPipe(fields));
}
