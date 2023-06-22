/* eslint-disable no-restricted-imports */
// Disabled for obvious reasons
import * as RQ from 'react-query';

const QueryRules: RQ.QueryClientConfig = {
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
};

// The options of the query.
// E.g. enabled.
type QueryOptions<T> = RQ.UseQueryOptions<T>;

// What a query *is*
export type Query<ReturnType> = {
	key: RQ.QueryKey;
	exec: () => Promise<ReturnType>;
};

// We want `useQuery`/`ies` to accept either a function or a `Query` directly
type QueryOrQueryFn<T> = Query<T> | (() => Query<T>);
// A simple util function to avoid conditions everywhere
const resolveQuery = <T>(q: QueryOrQueryFn<T>) => {
	if (typeof q === 'function') {
		return q();
	}
	return q;
};

const useQuery = <ReturnType>(
	query: QueryOrQueryFn<ReturnType>,
	options?: QueryOptions<ReturnType>
) => {
	const resolvedQuery = resolveQuery(query);
	return RQ.useQuery<ReturnType>(resolvedQuery.key, resolvedQuery.exec, options);
};

const transformQuery = <OldReturnType, NewReturnType>(
	query: Query<OldReturnType>,
	fn: (res: OldReturnType) => NewReturnType
) => {
	return {
		key: query.key,
		exec: () => query.exec().then(fn),
	};
};

const useQueries = <ReturnTypes>(
	queries: readonly QueryOrQueryFn<ReturnTypes>[],
	options?: QueryOptions<ReturnTypes>
) => {
	return RQ.useQueries(
		queries.map(resolveQuery).map(
			(query) =>
				({
					queryKey: query.key,
					queryFn: query.exec,
					...options,
				} as const)
		)
	);
};

export { useQuery, useQueries, QueryRules, transformQuery };
