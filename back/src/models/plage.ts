/*
 * Thanks to https://github.com/Arthi-chaud/Meelo/blob/master/src/pagination/models/paginated-response.ts
 */

import { Type, applyDecorators } from "@nestjs/common";
import {
	ApiExtraModels,
	ApiOkResponse,
	ApiProperty,
	getSchemaPath,
} from "@nestjs/swagger";

export class PlageMetadata {
	@ApiProperty()
	this: string;
	@ApiProperty({
		type: "string",
		nullable: true,
		description: "null if there is no next page, couldn't set it in swagger",
	})
	next: string | null;
	@ApiProperty({
		type: "string",
		nullable: true,
		description:
			"null if there is no previous page, couldn't set it in swagger",
	})
	previous: string | null;
}

export class Plage<T extends object> {
	@ApiProperty()
	metadata: PlageMetadata;
	data: T[];

	constructor(data: T[], request: Request | any) {
		this.data = data;
		let take = Number(request.query["take"] ?? 20).valueOf();
		if (take == 0) take = 20;
		let skipped: number = Number(request.query["skip"] ?? 0).valueOf();
		if (skipped % take) {
			skipped += take - (skipped % take);
		}
		this.metadata = {
			this: this.buildUrl(request.path, request.query),
			next:
				data.length >= take
					? this.buildUrl(request.path, {
							...request.query,
							skip: skipped + take,
					  })
					: null,
			previous: skipped
				? this.buildUrl(request.path, {
						...request.query,
						skip: Math.max(0, skipped - take),
				  })
				: null,
		};
	}

	private buildUrl(route: string, queryParameters: any) {
		if (queryParameters.skip == 0) delete queryParameters.skip;
		const builtQueryParameters = new URLSearchParams(
			queryParameters,
		).toString();
		if (builtQueryParameters.length) return `${route}?${builtQueryParameters}`;
		return route;
	}
}

export const ApiOkResponsePlaginated = <DataDto extends Type<unknown>>(
	dataDto: DataDto,
) =>
	applyDecorators(
		ApiExtraModels(Plage, dataDto),
		ApiOkResponse({
			schema: {
				allOf: [
					{ $ref: getSchemaPath(Plage) },
					{
						properties: {
							data: {
								type: "array",
								items: { $ref: getSchemaPath(dataDto) },
							},
						},
					},
				],
			},
		}),
	);
