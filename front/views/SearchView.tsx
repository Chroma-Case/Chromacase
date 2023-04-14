import React, { useState } from "react";
import { Box } from "native-base";
import { useNavigation } from "../Navigation";
import SearchBarSuggestions from "../components/SearchBarSuggestions";
import { useQueries, useQuery } from "react-query";
import { SuggestionType } from "../components/SearchBar";
import API from "../API";

const SearchView = () => {
	const [query, setQuery] = useState<string>();
	const navigation = useNavigation();
	const searchQuery = useQuery(
		['search', query],
		() => API.searchSongs(query!),
		{ enabled: query != undefined }
	);
	const artistsQueries = useQueries(searchQuery.data?.map((song) => (
		{ queryKey: ['artist', song.id], queryFn: () => API.getArtist(song.id) }
	)) ??[]);

	return (
		<Box style={{ padding: 10 }}>
			<SearchBarSuggestions
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
			/>
		</Box>
	);
};

export default SearchView;
