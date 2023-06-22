/* eslint-disable no-restricted-imports */
// Disabled for obvious reasons
import * as RQ from "react-query";

const QueryRules: RQ.QueryClientConfig  = {
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
}

type QueryOptions = Parameters<typeof RQ.useQuery>[2];

export type Query<ReturnType> = {
	key: RQ.QueryKey;
	exec: () => Promise<ReturnType>;
}

const useQuery = <ReturnType>(query: Query<ReturnType>, options: QueryOptions) => {
	return RQ.useQuery(query.key, query.exec, options);
}

const useQueries = <ReturnTypes extends unknown[]>(
	queries: readonly Query<ReturnTypes[number]>[],
	options: QueryOptions
) => {
	return RQ.useQueries(queries.map((query) => ({
		queryKey: query.key,
		queryFn: query.exec,
		...options
	} as const)));	
}


export { useQuery, useQueries, QueryRules };