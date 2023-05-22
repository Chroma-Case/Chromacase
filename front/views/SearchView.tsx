import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import Artist from "../models/Artist";
import Song from "../models/Song";
import Genre from "../models/Genre";
import API from "../API";
import { useQuery } from 'react-query';
import { SearchResultComponent } from "../components/SearchResult";
import { SafeAreaView} from "react-native";


interface SearchContextType {
	filter: "artist" | "song" | "genre" | "all";
	updateFilter: (newData: "artist" | "song" | "genre" | "all") => void;
	stringQuery: string;
	updateStringQuery: (newData: string) => void;
	songData: Song[];
	artistData: Artist[];
	genreData: Genre[];
	isLoadingSong: boolean;
	isLoadingArtist: boolean;
	isLoadingGenre: boolean;
}

export const SearchContext = React.createContext<SearchContextType>({
	filter: "all",
	updateFilter: () => {},
	stringQuery: "",
	updateStringQuery: () => {},
	songData: [],
	artistData: [],
	genreData: [],
	isLoadingSong: false,
	isLoadingArtist: false,
	isLoadingGenre: false,
})

const SearchView = ({navigation}: any) => {
	let isRequestSucceeded = false;
	const [filter, setFilter] = useState<any>('all');
	const [stringQuery, setStringQuery] = useState<string>('');

	const handleSuccess = () => {
		if (!isRequestSucceeded) {
			API.createSearchHistoryEntry(stringQuery, "song", Date.now());
			isRequestSucceeded = true;
		}
	};

	const { isLoading: isLoadingSong, data: songData = []} = useQuery(
		['song', stringQuery],
		() => API.searchSongs(stringQuery),
		{ enabled: !!stringQuery, onSuccess: handleSuccess }
	);

	const { isLoading: isLoadingArtist, data: artistData = []} = useQuery(
		['artist', stringQuery],
		() => API.searchArtists(stringQuery),
		{ enabled: !!stringQuery, onSuccess: handleSuccess}
	);
	
	const { isLoading: isLoadingGenre, data: genreData = []} = useQuery(
		['genre', stringQuery],
		() => API.searchGenres(stringQuery),
		{ enabled: !!stringQuery, onSuccess: handleSuccess }
	);

	const updateFilter = (newData: any) => {
		// called when the filter is changed
		setFilter(newData);
	}

	const updateStringQuery = (newData: string) => {
		// called when the stringQuery is updated
		setStringQuery(newData);
		isRequestSucceeded = false;
	}

	return (
			<SafeAreaView>
				<SearchContext.Provider value={{
						filter,
						stringQuery,
						songData,
						artistData,
						genreData,
						isLoadingSong,
						isLoadingArtist,
						isLoadingGenre,
						updateFilter,
						updateStringQuery,
						}}>
					<SearchBar/>
					<SearchResultComponent/>
				</SearchContext.Provider>
			</SafeAreaView>
	);
};

export default SearchView;
