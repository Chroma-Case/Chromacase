import React from 'react';
import ScaffoldCC from '../../components/UI/ScaffoldCC';
import SearchBarComponent from '../../components/V2/SearchBar';
import { RouteProps, useNavigation } from '../../Navigation';
import MusicList from '../../components/UI/MusicList';
import { useQuery } from '../../Queries';
import API from '../../API';
import { MusicItemType } from '../../components/UI/MusicItem';

export type searchProps = {
	artist: number | undefined;
	genre: number | undefined;
	query: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
const SearchView = (props: RouteProps<{}>) => {
	const navigation = useNavigation();
	// const [searchResult, setSearchResult] = React.useState([] as MusicItemType[]);
	const [searchQuery, setSearchQuery] = React.useState({artist: undefined, genre: undefined, query: ''} as searchProps)
	const rawResult = useQuery(API.searchSongs(searchQuery), { enabled: !!searchQuery });
	const result =
	rawResult.data?.map((song) => ({
		artist: song.artist!.name,
		song: song.name,
		image: song.cover,
		level: 42,
		lastScore: 42,
		bestScore: 42,
		liked: true,
		onLike: () => {
			console.log('onLike');
		},
		onPlay: () => navigation.navigate('Play', { songId: song.id }),
	})) ?? [];

	return (
		<ScaffoldCC routeName={props.route.name}>
			<SearchBarComponent onValidate={setSearchQuery} />
			<MusicList initialMusics={result} />
		</ScaffoldCC>
	);
};

export default SearchView;
