import React, { useMemo } from 'react';
import {
	HStack,
	VStack,
	Heading,
	Text,
	Pressable,
	Box,
	Card,
	Image,
	Flex,
	useBreakpointValue,
	Column,
	ScrollView,
} from 'native-base';
import { SafeAreaView, useColorScheme } from 'react-native';
import { RootState, useSelector } from '../state/Store';
import { SearchContext } from '../views/SearchView';
import { useQueries, useQuery } from '../Queries';
import { translate } from '../i18n/i18n';
import API from '../API';
import LoadingComponent from './Loading';
import ArtistCard from './ArtistCard';
import GenreCard from './GenreCard';
import SongCard from './SongCard';
import CardGridCustom from './CardGridCustom';
import TextButton from './TextButton';
import SearchHistoryCard from './HistoryCard';
import Song, { SongWithArtist } from '../models/Song';
import { useNavigation } from '../Navigation';
import Artist from '../models/Artist';
import SongRow from '../components/SongRow';


const swaToSongCardProps = (song: SongWithArtist) => ({
	songId: song.id,
	name: song.name,
	artistName: song.artist.name,
	cover: song.cover ?? 'https://picsum.photos/200',
});

const RowCustom = (props: Parameters<typeof Box>[0] & { onPress?: () => void }) => {
	const settings = useSelector((state: RootState) => state.settings.local);
	const systemColorMode = useColorScheme();
	const colorScheme = settings.colorScheme;

	return (
		<Pressable onPress={props.onPress}>
			{({ isHovered, isPressed }) => (
				<Box
					{...props}
					py={3}
					my={1}
					bg={
						(colorScheme == 'system' ? systemColorMode : colorScheme) == 'dark'
							? isHovered || isPressed
								? 'gray.800'
								: undefined
							: isHovered || isPressed
							? 'coolGray.200'
							: undefined
					}
				>
					{props.children}
				</Box>
			)}
		</Pressable>
	);
};

// type SongRowProps = {
// 	song: Song | SongWithArtist; // TODO: remove Song
// 	onPress: () => void;
// };

// const SongRow = ({ song, onPress }: SongRowProps) => {
// 	return (
// 		<RowCustom width={'100%'}>
// 			<HStack px={2} space={5} justifyContent={'space-between'}>
// 				<Image
// 					flexShrink={0}
// 					flexGrow={0}
// 					pl={10}
// 					style={{ zIndex: 0, aspectRatio: 1, borderRadius: 5 }}
// 					source={{ uri: song.cover }}
// 					alt={song.name}
// 				/>
// 				<HStack
// 					style={{
// 						display: 'flex',
// 						flexShrink: 1,
// 						flexGrow: 1,
// 						alignItems: 'center',
// 						justifyContent: 'flex-start',
// 					}}
// 					space={6}
// 				>
// 					<Text
// 						style={{
// 							flexShrink: 1,
// 						}}
// 						isTruncated
// 						pl={10}
// 						maxW={'100%'}
// 						bold
// 						fontSize="md"
// 					>
// 						{song.name}
// 					</Text>
// 					<Text
// 						style={{
// 							flexShrink: 0,
// 						}}
// 						fontSize={'sm'}
// 					>
// 						{song.artistId ?? 'artist'}
// 					</Text>
// 				</HStack>
// 				<TextButton
// 					flexShrink={0}
// 					flexGrow={0}
// 					translate={{ translationKey: 'playBtn' }}
// 					colorScheme="primary"
// 					variant={'outline'}
// 					size="sm"
// 					onPress={onPress}
// 				/>
// 			</HStack>
// 		</RowCustom>
// 	);
// };

SongRow.defaultProps = {
	onPress: () => {},
};

const HomeSearchComponent = () => {
	const { updateStringQuery } = React.useContext(SearchContext);
	const { isLoading: isLoadingHistory, data: historyData = [] } = useQuery(
		API.getSearchHistory(0, 12),
		{ enabled: true }
	);
	const songSuggestions = useQuery(API.getSongSuggestions);
	const songArtistSuggestions = useQueries(
		songSuggestions.data
			?.filter((song) => song.artistId !== null)
			.map(({ artistId }) => API.getArtist(artistId)) ?? []
	);
	const isLoadingSuggestions = useMemo(
		() => songSuggestions.isLoading || songArtistSuggestions.some((q) => q.isLoading),
		[songSuggestions, songArtistSuggestions]
	);
	const suggestionsData = useMemo(() => {
		if (isLoadingSuggestions) {
			return [];
		}
		return (
			songSuggestions.data
				?.map((song): [Song, Artist | undefined] => [
					song,
					songArtistSuggestions
						.map((q) => q.data)
						.filter((d) => d !== undefined)
						.find((data) => data?.id === song.artistId),
				])
				// We do not need the song
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				.filter(([song, artist]) => artist !== undefined)
				.map(([song, artist]) => ({ ...song, artist: artist! })) ?? []
		);
	}, [songSuggestions, songArtistSuggestions]);

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
				{isLoadingSuggestions ? (
					<LoadingComponent />
				) : (
					<CardGridCustom
						content={suggestionsData.map(swaToSongCardProps)}
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
	const { songData } = React.useContext(SearchContext);
	const navigation = useNavigation();

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
							onPress={() => {
								API.createSearchHistoryEntry(comp.name, 'song');
								navigation.navigate('Song', { songId: comp.id });
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
					content={artistData.slice(0, props.maxItems ?? artistData.length).map((artistData) => ({
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
							navigation.navigate('Genre', {genreId: g.id});
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

const FavoriteSearchComponent = (props: SongsSearchComponentProps) => {
	const { favoriteData } = React.useContext(SearchContext);
	const navigation = useNavigation();

	return (
		<Box>
			<Text fontSize="xl" fontWeight="bold" mt={4}>
				{translate('favoriteFilter')}
			</Text>
			<Box>
				{favoriteData?.length ? (
					favoriteData.slice(0, props.maxRows).map((comp, index) => (
						<SongRow
							key={index}
							song={comp}
							onPress={() => {
								API.createSearchHistoryEntry(comp.name, 'song');
								navigation.navigate('Song', { songId: comp.id });
							}}
						/>
					))
				) : (
					<Text>{translate('errNoResults')}</Text>
				)}
			</Box>
		</Box>
	)
}

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
		case 'favorite':
			return <FavoriteSearchComponent />;
		default:
			return <Text>Something very bad happened: {currentFilter}</Text>;
	}
};

export const SearchResultComponent = () => {
	const { stringQuery } = React.useContext(SearchContext);
	const { filter } = React.useContext(SearchContext);
	const shouldOutput = !!stringQuery.trim() || filter == "favorite";

	return shouldOutput ? (
		<Box p={5}>
			<FilterSwitch />
		</Box>
	) : (
		<HomeSearchComponent />
	);
};
