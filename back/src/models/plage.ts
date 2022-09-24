/*
 * Thanks to https://github.com/Arthi-chaud/Meelo/blob/master/src/pagination/models/paginated-response.ts
 */

export class Plage<T> {
	metadata: {
		this: string;
		next: string | null;
		previous: string | null;
	};
	data: T[];

	constructor(data: T[], request: Request | any) {
		this.data = data;
		let take = Number(request.query['take'] ?? 20).valueOf();
		if (take == 0) take = 20;
		let skipped: number = Number(request.query['skip'] ?? 0).valueOf();
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
