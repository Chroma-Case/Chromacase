import { Box, Flex, Heading, useBreakpointValue, ScrollView, useColorModeValue } from 'native-base';
import { useQueries, useQuery } from '../Queries';
import { LoadingView } from '../components/Loading';
import { RouteProps, useNavigation } from '../Navigation';
import API from '../API';
import CardGridCustom from '../components/CardGridCustom';
import SongCard from '../components/SongCard';

const colorRange = ['#364fc7', '#5c940d', '#c92a2a', '#d6336c', '#20c997'];

type GenreDetailsViewProps = {
	genreId: number;
}

const GenreDetailsView = ({ genreId }: RouteProps<GenreDetailsViewProps>) => {
	const genreQuery = useQuery(API.getGenre(genreId))
	const songsQuery = useQuery(API.getSongsByGenre(genreId))
	const artistQueries = useQueries(songsQuery.data?.map((song) => song.artistId).map((artistId) => API.getArtist(artistId)) ?? []);
	// Here, .artist will always be defined
	const songWithArtist = songsQuery?.data?.map((song) => ({
		...song,
		artist: artistQueries.find((query) => query.data?.id == song.artistId)?.data
	})).filter((song) => song.artist !== undefined);

	const screenSize = useBreakpointValue({ base: "small", md: "big" });
	const isMobileView = screenSize == "small";
	const fadeColor = useColorModeValue('#ffffff', '#000000');
	const navigation = useNavigation();

	if (genreQuery.isError || songsQuery.isError) {
		navigation.navigate('Error');
		return <></>;
	}
	if (!genreQuery.data || songsQuery.data === undefined || songWithArtist === undefined) {
		return <LoadingView />;
	}

	return (
		<ScrollView>
			<Box
			size={'100%'}
			height={isMobileView ? 200 : 300}
			width={'100%'}
			bg={{
				linearGradient: {
					colors: [colorRange[Math.floor(Math.random() * 5)] ?? '#364fc7', fadeColor],
					start: [0, 0],
					end: [0, 1],
				},}}
			/>
			<Heading ml={3} fontSize={50}>{genreQuery.data.name}</Heading>
			<Flex
				flexWrap="wrap"
				direction={isMobileView ? 'column' : 'row'}
				justifyContent={['flex-start']}
				mt={4}
			>
				<CardGridCustom
					content={songWithArtist.map((songData) => ({
						name: songData.name,
						cover: songData.cover,
						artistName: songData.artist!.name,
						songId: songData.id,
						onPress: () => {
							API.createSearchHistoryEntry(songData.name, 'song');
							navigation.navigate('Song', { songId: songData.id });
						},
					}))}
					cardComponent={SongCard}
				/>
			</Flex>
		</ScrollView>
);
}

export default GenreDetailsView;