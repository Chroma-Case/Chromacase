import React, { useContext, useEffect, useState } from "react";
import { Box, List, Stack } from "native-base";
import SearchBar from "../components/SearchBar";
import { translate } from "../i18n/i18n";
import Album from "../models/Album";
import Artist from "../models/Artist";
import Song from "../models/Song";
import Genre from "../models/Genre";
import API from "../API";
import { useMutation } from 'react-query';
import { useQuery } from 'react-query';
import { SearchResultComponent } from "../components/SearchResult";
import LoadingComponent from "../components/Loading";
import { string } from "yup";
import { Alert } from "react-native";

// const handleSearchArtist = async (text: string, dataSetter: (data: Artist[]) => void): Promise<string> => {
// 	try {
// 		const foundArtists: Artist[] = await API.searchArtists(text);
// 		dataSetter(foundArtists)
// 		return 'success';
// 	} catch (error) {
// 		return translate('unknownError') + ': ' + error;
// 	}
// }

// const handleRetrieveGenres = async (dataSetter: (data: Artist[]) => void): Promise<string> => {
// 	try {
// 		const retrievedGenres: Genre[] = await API.retrieveGenres();
// 		dataSetter(retrievedGenres)
// 		return 'success';
// 	} catch (error) {
// 		return translate('unknownError') + ': ' + error;
// 	}
// }

// const handleSearchAlbum = async (text: string, dataSetter: (data: Album[]) => void): Promise<string> => {
// 	try {
// 		const foundAlbums: Album[] = await API.searchAlbum(text);
// 		dataSetter(foundAlbums)
// 		return 'success';
// 	} catch (error) {
// 		return translate('unknownError') + ': ' + error;
// 	}
// }

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
	const [filter, setFilter] = useState<any>('all');
	const [stringQuery, setStringQuery] = useState<string>('');
	const { isLoading: isLoadingSong, data: songData, error: songError } = useQuery(
		['song', stringQuery],
		() => API.searchSongs(stringQuery),
		{ enabled: !!stringQuery }
	);
	const { isLoading: isLoadingArtist, data: artistData, error: artistError } = useQuery(
		['artist', stringQuery],
		() => API.searchArtists(stringQuery),
		{ enabled: !!stringQuery }
	);
	const { isLoading: isLoadingGenre, data: genreData, error: genreError } = useQuery(
		['genre', stringQuery],
		() => API.searchGenres(stringQuery),
		{ enabled: !!stringQuery }
	);

	const updateFilter = (newData: any) => {
		setFilter(newData);
	}

	const updateStringQuery = (newData: any) => {
		setStringQuery(newData);
	}
	// const [query, setQuery] = useState<string>();
	// const navigation = useNavigation();
	// const searchQuery = useQuery(
	// 	['search', query],
	// 	() => API.searchSongs(query!),
	// 	{ enabled: query != undefined }
	// );
	// const artistsQueries = useQueries(searchQuery.data?.map((song) => (
	// 	{ queryKey: ['artist', song.id], queryFn: () => API.getArtist(song.id) }
	// )) ??[]);

	return (
			<Stack>
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
			</Stack>
	);
};

export default SearchView;
