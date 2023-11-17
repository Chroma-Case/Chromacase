import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

export type IncludeMap<IncludeType> = {
	[key in keyof IncludeType]:
		| boolean
		| ((ctx: { user: { id: number; username: string } }) => IncludeType[key]);
};

export function mapInclude<IncludeType>(
	include: string | undefined,
	req: Request,
	fields: IncludeMap<IncludeType>,
): IncludeType | undefined {
	if (!include) return undefined;

	const ret: IncludeType = {} as IncludeType;
	for (const key of include.split(',')) {
		const value =
			typeof fields[key] === 'function'
				? fields[key]({ user: req.user })
				: fields[key];
		if (value !== false && value !== undefined) ret[key] = value;
		else {
			throw new BadRequestException(
				`Invalid include, ${key} is not valid. Valid includes are: ${Object.keys(
					fields,
				).join(', ')}.`,
			);
		}
	}
	return ret;
}