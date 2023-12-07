import React from 'react';
import ScaffoldCC from '../../components/UI/ScaffoldCC';
import SearchBarComponent from '../../components/V2/SearchBar';
import { RouteProps, useNavigation } from '../../Navigation';
import MusicList from '../../components/UI/MusicList';
import { useQuery } from '../../Queries';
import API from '../../API';
import Song from '../../models/Song';
import { MusicItemType } from '../../components/UI/MusicItem';

export type searchProps = {
	artist: number | undefined,
	genre: number | undefined,
	query: string,
}

// eslint-disable-next-line @typescript-eslint/ban-types
const SearchView = (props: RouteProps<{}>) => {
	const navigation = useNavigation();
	const [searchResult, setSearchResult] = React.useState([] as MusicItemType[]);

	const handleSearch = async (searchQuery: searchProps) => {
		const rawResult = useQuery(API.getAllSongs());
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
		setSearchResult(result ?? []);
	}

	
	return (
		<ScaffoldCC routeName={props.route.name}>
			<SearchBarComponent onValidate={handleSearch} />
			<MusicList initialMusics={searchResult} />
		</ScaffoldCC>
	);
};

export default SearchView;
