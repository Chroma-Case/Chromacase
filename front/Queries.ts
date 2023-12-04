/* eslint-disable no-restricted-imports */
// Disabled for obvious reasons
import * as RQ from 'react-query';

const QueryRules: RQ.QueryClientConfig = {
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			// This is needed explicitly, otherwise will refetch **all** the time
			staleTime: Infinity,
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
const queryToFn = <T>(q: QueryOrQueryFn<T>) => {
	if (typeof q === 'function') {
		return q;
	}
	return () => q;
};

// This also allows lazy laoding of query function.
// I.e. not call the function before it is enabled;
const buildRQuery = <T, Opts extends QueryOptions<T>>(q: QueryOrQueryFn<T>, opts?: Opts) => {
	const laziedQuery = queryToFn(q);
	if (opts?.enabled === false) {
		return {
			queryKey: [],
			// This will not be called because the query is disabled.
			// However, this is done for type-safety
			queryFn: () => laziedQuery().exec(),
			...opts,
		};
	}
	const resolvedQuery = laziedQuery();
	return {
		queryKey: resolvedQuery.key,
		queryFn: resolvedQuery.exec,
		...opts,
	};
};

const useQuery = <ReturnType, Opts extends QueryOptions<ReturnType>>(
	query: QueryOrQueryFn<ReturnType>,
	options?: Opts
) => {
	return RQ.useQuery<ReturnType>(buildRQuery(query, options));
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

export { useQuery, QueryRules, transformQuery };
