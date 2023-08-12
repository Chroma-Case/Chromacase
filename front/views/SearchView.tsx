import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import Artist from '../models/Artist';
import Song from '../models/Song';
import Genre from '../models/Genre';
import API from '../API';
import { useQuery } from '../Queries';
import { SearchResultComponent } from '../components/SearchResult';
import { SafeAreaView } from 'react-native';
import { Filter } from '../components/SearchBar';
import { ScrollView } from 'native-base';
import { RouteProps } from '../Navigation';

interface SearchContextType {
	filter: 'artist' | 'song' | 'genre' | 'all' | 'favorite';
	updateFilter: (newData: 'artist' | 'song' | 'genre' | 'all' | 'favorite') => void;
	stringQuery: string;
	updateStringQuery: (newData: string) => void;
	songData: Song[];
	artistData: Artist[];
	genreData: Genre[];
	favoriteData: Song[];
	isLoadingSong: boolean;
	isLoadingArtist: boolean;
	isLoadingGenre: boolean;
}

export const SearchContext = React.createContext<SearchContextType>({
	filter: 'all',
	updateFilter: () => {},
	stringQuery: '',
	updateStringQuery: () => {},
	songData: [],
	artistData: [],
	genreData: [],
	favoriteData: [],
	isLoadingSong: false,
	isLoadingArtist: false,
	isLoadingGenre: false,
});

type SearchViewProps = {
	query?: string;
};

const SearchView = (props: RouteProps<SearchViewProps>) => {
	const [filter, setFilter] = useState<Filter>('all');
	const [stringQuery, setStringQuery] = useState<string>(props?.query ?? '');

	const { isLoading: isLoadingSong, data: songData = [] } = useQuery(
		API.searchSongs(stringQuery),
		{ enabled: !!stringQuery }
	);

	const { isLoading: isLoadingArtist, data: artistData = [] } = useQuery(
		API.searchArtists(stringQuery),
		{ enabled: !!stringQuery }
	);

	const { isLoading: isLoadingGenre, data: genreData = [] } = useQuery(
		API.searchGenres(stringQuery),
		{ enabled: !!stringQuery }
	);

	const { isLoading: isLoadingFavorite, data: favoriteData = [] } = useQuery(
		API.getFavorites(),
		{ enabled: true }
	)

	const updateFilter = (newData: Filter) => {
		// called when the filter is changed
		setFilter(newData);
	};

	const updateStringQuery = (newData: string) => {
		// called when the stringQuery is updated
		setStringQuery(newData);
	};

	return (
		<ScrollView>
			<SafeAreaView>
				<SearchContext.Provider
					value={{
						filter,
						stringQuery,
						songData,
						artistData,
						genreData,
						favoriteData,
						isLoadingSong,
						isLoadingArtist,
						isLoadingGenre,
						updateFilter,
						updateStringQuery,
					}}
				>
					<SearchBar />
					<SearchResultComponent />
				</SearchContext.Provider>
			</SafeAreaView>
		</ScrollView>
	);
};

export default SearchView;
