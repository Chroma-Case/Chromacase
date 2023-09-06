import { SafeAreaView } from 'react-native';
import { VStack, Text, Box, Flex, Image, Heading, IconButton, Icon, Container, Center, useBreakpointValue, ScrollView } from 'native-base';
import { useQueries, useQuery } from '../Queries';
import { LoadingView } from '../components/Loading';
import { RouteProps, useNavigation } from '../Navigation';
import API from '../API';
import Artist from '../models/Artist';
import ArtistCard from '../components/ArtistCard';
import CardGridCustom from '../components/CardGridCustom';
import { translate } from '../i18n/i18n';
import SongCard from '../components/SongCard';

const colorRange = ['#364fc7', '#5c940d', '#c92a2a', '#d6336c', '#20c997'];

type GenreDetailsViewProps = {
	genreId: number;
}

const GenreDetailsView = ({ genreId }: RouteProps<GenreDetailsViewProps>) => {
	const genreQuery = useQuery(API.getGenre(genreId))
	const songsQuery = useQuery(API.getSongsByGenre(genreId))
	const screenSize = useBreakpointValue({ base: "small", md: "big" });
	const isMobileView = screenSize == "small";
	const navigation = useNavigation();


	if (genreQuery.isError || songsQuery.isError) {
		navigation.navigate('Error');
		return <></>;
	}
	if (!genreQuery.data || songsQuery.data === undefined) {
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
					colors: [colorRange[Math.floor(Math.random() * 5)] ?? '#364fc7', 'black'],
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
					content={songsQuery.data.map((songData) => ({
						name: songData.name,
						cover: songData.cover,
						artistName: songData.artistId.toString(),
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