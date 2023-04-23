import React, { useState } from "react";
import { Box, List, Stack } from "native-base";
import SearchBar from "../components/SearchBar";
import { translate } from "../i18n/i18n";
import { SearchBarFilter } from "../components/SearchBar";
import Song from "../models/Song";
import Album from "../models/Album";
import Artist from "../models/Artist";
import API from "../API";
import Genre from "../models/Genre";

const handleSearchArtist = async (text: string, dataSetter: (data: Artist[]) => void): Promise<string> => {
	try {
		const foundArtists: Artist[] = await API.searchArtists(text);
		dataSetter(foundArtists)
		return 'success';
	} catch (error) {
		return translate('unknownError') + ': ' + error;
	}
}

const handleRetrieveGenres = async (dataSetter: (data: Artist[]) => void): Promise<string> => {
	try {
		const retrievedGenres: Genre[] = await API.retrieveGenres();
		dataSetter(retrievedGenres)
		return 'success';
	} catch (error) {
		return translate('unknownError') + ': ' + error;
	}
}

const handleSearchAlbum = async (text: string, dataSetter: (data: Album[]) => void): Promise<string> => {
	try {
		const foundAlbums: Album[] = await API.searchAlbum(text);
		dataSetter(foundAlbums)
		return 'success';
	} catch (error) {
		return translate('unknownError') + ': ' + error;
	}
}

// const handleTextChange = async (text: string, list: any[], listSetter: (list: any[]) => void): Promise<string> => {
// 	try {
// 		if (list.) {

// 		} else {

// 		}
// 		return 'success';
// 	} catch (error) {
// 		return translate('unknownError') + ': ' + error;
// 	}
// }

export const filters: SearchBarFilter[] = [
	{
		name: 'All',
		type: 'fav',
		componentType: 'provided-list',
		icon: 'favorite',
		options: ['Favorites'],
		searchCallBack: handleSearchArtist,
	},
	{
		name: 'Genre',
		type: 'genre',
		componentType: 'retrieved-list',
		icon: 'music-note',
		searchCallBack: handleRetrieveGenres,
	},
	{
		name: 'Year',
		type: 'date',
		componentType: 'provided-list',
		options: ['After 2000','90\'s', '80\'s', '70\'s', '60\'s', '50\'s', '40\'s', '30\'s', '20\'s', '10\'s', 'Before 1900'],
		searchCallBack: undefined,
	},
	{
		name: 'Artist',
		type: 'artist',
		componentType: "search-list",
		icon: 'people',
		searchCallBack: handleSearchArtist,
	},
	{
		name: "Album",
		type: "album",
		componentType: 'search-list',
		icon: 'album',
		searchCallBack: handleSearchAlbum,
	},
];

const SearchView = ({navigation}: any) => {
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
	const [list, setList] = React.useState([] as Song[])

	return (
		<Stack>
			{/* <SearchBarSuggestions
				onTextSubmit={setQuery}
				suggestions={searchQuery.data?.map((searchResult) => ({
					type: SuggestionType.ILLUSTRATED,
					data: {
						text: searchResult.name,
						subtext: artistsQueries.find((artistQuery) => artistQuery.data?.id == searchResult.artistId)?.data?.name ?? "",
						imageSrc: searchResult.cover,
						onPress: () => navigation.navigate("Song", { songId: searchResult.id })
					}
				})) ?? []}
			/> */}
			<SearchBar filters={filters} placeHolder={translate('searchBtn')} onChangeText={}/>
			<List>
				{list.map((comp: Song, index) => (
					<List.Item key={index}>{comp.name}</List.Item>
				))}
			</List>
			</Stack>
	);
};

export default SearchView;
