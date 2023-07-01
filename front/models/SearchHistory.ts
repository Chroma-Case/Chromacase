import Model, { ModelValidator } from './Model';
import * as yup from 'yup';

export const SearchType = ['song', 'artist', 'album'] as const;
export type SearchType = typeof SearchType[number];

export const SearchHistoryValidator = yup.object({
	query: yup.string().required(),
	type: yup.mixed<SearchType>().oneOf(SearchType).required(),
	userId: yup.number().required(),
	searchDate: yup.date().required()
}).concat(ModelValidator);

interface SearchHistory extends Model {
	query: string;
	type: 'song' | 'artist' | 'album' | 'genre';
	userId: number;
	timestamp: Date;
}

export default SearchHistory;
