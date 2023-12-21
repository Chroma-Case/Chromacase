import React from 'react';
import ScaffoldCC from '../../components/UI/ScaffoldCC';
import SearchBarComponent from '../../components/V2/SearchBar';
import { RouteProps, useNavigation } from '../../Navigation';
import MusicList from '../../components/UI/MusicList';
import { useQuery } from '../../Queries';
import API from '../../API';
import { MusicItemType } from '../../components/UI/MusicItem';
import { View } from 'react-native';

export type searchProps = {
	artist: number | undefined;
	genre: number | undefined;
	query: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
const SearchView = (props: RouteProps<{}>) => {
	const navigation = useNavigation();
	// const [searchResult, setSearchResult] = React.useState([] as MusicItemType[]);
	const [searchQuery, setSearchQuery] = React.useState({} as searchProps);
	const rawResult = useQuery(API.searchSongs(searchQuery), {enabled: !!searchQuery.query});
	const result =
	rawResult.data?.map((song) => ({
		artist: song?.artist?.name ?? 'duh',
		song: song?.name,
		image: song?.cover,
		level: 42,
		lastScore: 42,
		bestScore: 42,
		liked: true,
		onLike: () => {
			console.log('onLike');
		},
		onPlay: () => navigation.navigate('Play', { songId: song.id }),
	})) ?? [];

	const handleLog = (query: searchProps) => {
		console.log("got query: ", query.query);
		setSearchQuery(query);
		// rawResult.refetch();
	}

	return (
		<ScaffoldCC routeName={props.route.name}>
			<View style={{display: 'flex', gap: 20}} >
			<SearchBarComponent onValidate={(data) => handleLog(data)} />
			{/* {result ? <MusicList initialMusics={result} /> : null} */}
			</View>
		</ScaffoldCC>
	);
};

export default SearchView;
