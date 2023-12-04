import { Flex, Heading, useBreakpointValue, ScrollView } from 'native-base';
import { useQuery } from '../Queries';
import { LoadingView } from '../components/Loading';
import { RouteProps, useNavigation } from '../Navigation';
import API from '../API';
import CardGridCustom from '../components/CardGridCustom';
import SongCard from '../components/SongCard';
import { ImageBackground } from 'react-native';

type GenreDetailsViewProps = {
	genreId: number;
};

const GenreDetailsView = ({ genreId }: RouteProps<GenreDetailsViewProps>) => {
	const genreQuery = useQuery(API.getGenre(genreId));
	const songsQuery = useQuery(API.getSongsByGenre(genreId, ['artist']));
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isMobileView = screenSize == 'small';
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
			<ImageBackground
				style={{ width: '100%', height: isMobileView ? 200 : 300 }}
				source={{ uri: API.getGenreIllustration(genreQuery.data.id) }}
			></ImageBackground>
			<Heading ml={3} fontSize={50}>
				{genreQuery.data.name}
			</Heading>
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
						artistName: songData.artist!.name,
						songId: songData.id,
						onPress: () => {
							API.createSearchHistoryEntry(songData.name, 'song');
							navigation.navigate('Play', { songId: songData.id });
						},
					}))}
					cardComponent={SongCard}
				/>
			</Flex>
		</ScrollView>
	);
};

export default GenreDetailsView;
