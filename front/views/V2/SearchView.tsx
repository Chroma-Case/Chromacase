import React from 'react';
import { View } from 'react-native';
import { useQuery } from '../../Queries';
import SearchBarComponent from '../../components/V2/SearchBar';
import SearchHistory from '../../components/V2/SearchHistory';
import API from '../../API';
import LoadingComponent from '../../components/Loading';
import MusicListCC from '../../components/UI/MusicList';

export type searchProps = {
	artist: number | undefined;
	genre: number | undefined;
	query: string;
};

const SearchView = () => {
	const artistsQuery = useQuery(API.getAllArtists());
	const [searchQuery, setSearchQuery] = React.useState({} as searchProps);
	const rawResult = useQuery(API.searchSongs(searchQuery, ['artist']), {
		enabled: !!searchQuery.query || !!searchQuery.artist || !!searchQuery.genre,
		onSuccess() {
			const artist =
				artistsQuery?.data?.find(({ id }) => id == searchQuery.artist)?.name ??
				'unknown artist';
			searchQuery.query ? API.createSearchHistoryEntry(searchQuery.query, 'song') : null;
			if (artist != 'unknown artist') API.createSearchHistoryEntry(artist, 'artist');
		},
	});

	if (artistsQuery.isLoading) {
		return <LoadingComponent />;
	}

	return (
		<View style={{ display: 'flex', gap: 20 }}>
			<SearchBarComponent onValidate={(query) => setSearchQuery(query)} />
			{rawResult.isSuccess ? (
				<MusicListCC
					musics={rawResult.data}
					isFetching={rawResult.isFetching}
					refetch={rawResult.refetch}
				/>
			) : (
				<SearchHistory />
			)}
		</View>
	);
};

export default SearchView;
