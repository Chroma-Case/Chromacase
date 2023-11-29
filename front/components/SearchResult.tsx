import React, { useMemo } from 'react';
import {
	VStack,
	Heading,
	Text,
	Box,
	Card,
	Flex,
	useBreakpointValue,
	Column,
	ScrollView,
} from 'native-base';
import { SafeAreaView } from 'react-native';
import { SearchContext } from '../views/SearchView';
import { useQuery } from '../Queries';
import { translate } from '../i18n/i18n';
import API from '../API';
import LoadingComponent, { LoadingView } from './Loading';
import ArtistCard from './ArtistCard';
import GenreCard from './GenreCard';
import SongCard from './SongCard';
import CardGridCustom from './CardGridCustom';
import SearchHistoryCard from './HistoryCard';
import Song from '../models/Song';
import { useNavigation } from '../Navigation';
import Artist from '../models/Artist';
import SongRow from '../components/SongRow';
import FavSongRow from './FavSongRow';

const swaToSongCardProps = (song: Song) => ({
	songId: song.id,
	name: song.name,
	artistName: song.artist!.name,
	cover: song.cover ?? 'https://picsum.photos/200',
});

const HomeSearchComponent = () => {
	const { updateStringQuery } = React.useContext(SearchContext);
	const { isLoading: isLoadingHistory, data: historyData = [] } = useQuery(
		API.getSearchHistory(0, 12),
		{ enabled: true }
	);
	const songSuggestions = useQuery(API.getSongSuggestions(['artist']));

	return (
		<VStack mt="5" style={{ overflow: 'hidden' }}>
			<Card shadow={3} mb={5}>
				<Heading margin={5}>{translate('lastSearched')}</Heading>
				{isLoadingHistory ? (
					<LoadingComponent />
				) : (
					<CardGridCustom
						content={historyData.map((h) => {
							return {
								...h,
								timestamp: h.timestamp.toLocaleString(),
								onPress: () => {
									updateStringQuery(h.query);
								},
							};
						})}
						cardComponent={SearchHistoryCard}
					/>
				)}
			</Card>
			<Card shadow={3} mt={5} mb={5}>
				<Heading margin={5}>{translate('songsToGetBetter')}</Heading>
				{!songSuggestions.data ? (
					<LoadingComponent />
				) : (
					<CardGridCustom
						content={songSuggestions.data.map(swaToSongCardProps)}
						cardComponent={SongCard}
					/>
				)}
			</Card>
		</VStack>
	);
};

type SongsSearchComponentProps = {
	maxRows?: number;
};

const SongsSearchComponent = (props: SongsSearchComponentProps) => {
	const navigation = useNavigation();
	const { songData } = React.useContext(SearchContext);
	const favoritesQuery = useQuery(API.getLikedSongs());

	const handleFavoriteButton = async (state: boolean, songId: number): Promise<void> => {
		if (state == false) await API.removeLikedSong(songId);
		else await API.addLikedSong(songId);
	};

	return (
		<ScrollView>
			<Text fontSize="xl" fontWeight="bold" mt={4}>
				{translate('songsFilter')}
			</Text>
			<Box>
				{songData?.length ? (
					songData.slice(0, props.maxRows).map((comp, index) => (
						<SongRow
							key={index}
							song={comp}
							isLiked={
								!favoritesQuery.data?.find((query) => query?.songId == comp.id)
							}
							handleLike={(state: boolean, songId: number) =>
								handleFavoriteButton(state, songId)
							}
							onPress={() => {
								API.createSearchHistoryEntry(comp.name, 'song');
								navigation.navigate('Play', { songId: comp.id });
							}}
						/>
					))
				) : (
					<Text>{translate('errNoResults')}</Text>
				)}
			</Box>
		</ScrollView>
	);
};

type ItemSearchComponentProps = {
	maxItems?: number;
};

const ArtistSearchComponent = (props: ItemSearchComponentProps) => {
	const { artistData } = React.useContext(SearchContext);
	const navigation = useNavigation();

	return (
		<Box>
			<Text fontSize="xl" fontWeight="bold" mt={4}>
				{translate('artistFilter')}
			</Text>
			{artistData?.length ? (
				<CardGridCustom
					content={artistData
						.slice(0, props.maxItems ?? artistData.length)
						.map((artistData) => ({
							image: API.getArtistIllustration(artistData.id),
							name: artistData.name,
							id: artistData.id,
							onPress: () => {
								API.createSearchHistoryEntry(artistData.name, 'artist');
								navigation.navigate('Artist', { artistId: artistData.id });
							},
						}))}
					cardComponent={ArtistCard}
				/>
			) : (
				<Text>{translate('errNoResults')}</Text>
			)}
		</Box>
	);
};

const GenreSearchComponent = (props: ItemSearchComponentProps) => {
	const { genreData } = React.useContext(SearchContext);
	const navigation = useNavigation();

	return (
		<Box>
			<Text fontSize="xl" fontWeight="bold" mt={4}>
				{translate('genreFilter')}
			</Text>
			{genreData?.length ? (
				<CardGridCustom
					content={genreData.slice(0, props.maxItems ?? genreData.length).map((g) => ({
						image: API.getGenreIllustration(g.id),
						name: g.name,
						id: g.id,
						onPress: () => {
							API.createSearchHistoryEntry(g.name, 'genre');
							navigation.navigate('Genre', { genreId: g.id });
						},
					}))}
					cardComponent={GenreCard}
				/>
			) : (
				<Text>{translate('errNoResults')}</Text>
			)}
		</Box>
	);
};

const FavoritesComponent = () => {
	const navigation = useNavigation();
	const favoritesQuery = useQuery(API.getLikedSongs());

	if (favoritesQuery.isError) {
		navigation.navigate('Error');
		return <></>;
	}
	if (!favoritesQuery.data) {
		return <LoadingView />;
	}

	return (
		<ScrollView>
			<Text fontSize="xl" fontWeight="bold" mt={4}>
				{translate('songsFilter')}
			</Text>
			<Box>
				{favoritesQuery.data?.map((songData) => (
					<FavSongRow
						key={songData.id}
						song={songData.song}
						addedDate={songData.addedDate}
						onPress={() => {
							API.createSearchHistoryEntry(songData.song.name, 'song'); //todo
							navigation.navigate('Play', { songId: songData.song!.id });
						}}
					/>
				))}
			</Box>
		</ScrollView>
	);
};

const AllComponent = () => {
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isMobileView = screenSize == 'small';

	return (
		<SafeAreaView>
			<Flex
				flexWrap="wrap"
				direction={isMobileView ? 'column' : 'row'}
				justifyContent={['flex-start']}
				mt={4}
			>
				<Column w={isMobileView ? '100%' : '50%'}>
					<Box minH={isMobileView ? 100 : 200}>
						<ArtistSearchComponent maxItems={6} />
					</Box>
					<Box minH={isMobileView ? 100 : 200}>
						<GenreSearchComponent maxItems={6} />
					</Box>
				</Column>
				<Box w={isMobileView ? '100%' : '50%'}>
					<SongsSearchComponent maxRows={9} />
				</Box>
			</Flex>
		</SafeAreaView>
	);
};

const FilterSwitch = () => {
	const { filter } = React.useContext(SearchContext);
	const [currentFilter, setCurrentFilter] = React.useState(filter);

	React.useEffect(() => {
		setCurrentFilter(filter);
	}, [filter]);

	switch (currentFilter) {
		case 'all':
			return <AllComponent />;
		case 'song':
			return <SongsSearchComponent />;
		case 'artist':
			return <ArtistSearchComponent />;
		case 'genre':
			return <GenreSearchComponent />;
		case 'favorites':
			return <FavoritesComponent />;
		default:
			return <Text>Something very bad happened: {currentFilter}</Text>;
	}
};

export const SearchResultComponent = () => {
	const { stringQuery } = React.useContext(SearchContext);
	const { filter } = React.useContext(SearchContext);
	const shouldOutput = !!stringQuery.trim() || filter == 'favorites';

	return shouldOutput ? (
		<Box p={5}>
			<FilterSwitch />
		</Box>
	) : (
		<HomeSearchComponent />
	);
};
