import React from 'react';
import ScaffoldCC from '../../components/UI/ScaffoldCC';
import SearchBarComponent from '../../components/V2/SearchBar';
import { RouteProps, useNavigation } from '../../Navigation';
import MusicList from '../../components/UI/MusicList';
import { useQuery } from '../../Queries';
import API from '../../API';
import { View, Text } from 'react-native';
import SearchHistory from '../../components/V2/SearchHistory';
import MusicListComponent from '../../components/UI/MusicList';
import MusicItem from '../../components/UI/MusicItem';

export type searchProps = {
	artist: number | undefined;
	genre: number | undefined;
	query: string;
};

const TaRace = ({yes}: {yes: any[]}) => {
	const navigation = useNavigation();

	return (
		<View>
			{yes.map((song) => (
				<MusicItem
				artist={song?.artist?.name ?? 'duh'}
				song={song?.name}
				image={song?.cover}
				lastScore={42}
				bestScore={42}
				liked={true}
				onLike={() => {
					console.log('onLike');
				}}
				onPlay={() => navigation.navigate('Play', { songId: song.id })}
				/>
			))}
		</View>
	);
}

// eslint-disable-next-line @typescript-eslint/ban-types
const SearchView = (props: RouteProps<{}>) => {
	const navigation = useNavigation();
	const [searchQuery, setSearchQuery] = React.useState({} as searchProps);
	const rawResult = useQuery(API.getAllSongs(searchQuery.query), {enabled: !!searchQuery.query,
		onSuccess() {
			setSearchQuery({} as searchProps);
		}, onError() {
			setSearchQuery({} as searchProps);
		},});
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
	}

	console.table('result:', result);
	console.table('raw:', rawResult);

	return (
		<ScaffoldCC routeName={props.route.name}>
			<View style={{display: 'flex', gap: 20}} >
				<SearchBarComponent onValidate={(data) => handleLog(data)} />
				{result
				? <TaRace yes={result} />
				: <SearchHistory />}
			</View>
		</ScaffoldCC>
	);
};

export default SearchView;
