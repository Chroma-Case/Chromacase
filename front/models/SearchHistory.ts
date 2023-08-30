import Model, { ModelValidator } from './Model';
import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';

export const SearchType = ['song', 'artist', 'album', 'genre'] as const;
export type SearchType = (typeof SearchType)[number];

const SearchHistoryValidator = yup
	.object({
		query: yup.string().required(),
		type: yup.mixed<SearchType>().oneOf(SearchType).required(),
		userId: yup.number().required(),
		searchDate: yup.date().required(),
	})
	.concat(ModelValidator);

export const SearchHistoryHandler: ResponseHandler<
	yup.InferType<typeof SearchHistoryValidator>,
	SearchHistory
> = {
	validator: SearchHistoryValidator,
	transformer: (value) => ({
		...value,
		timestamp: value.searchDate,
	}),
};

interface SearchHistory extends Model {
	query: string;
	type: 'song' | 'artist' | 'album' | 'genre';
	userId: number;
	timestamp: Date;
}

export default SearchHistory;
