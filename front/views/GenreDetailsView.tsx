import { SafeAreaView } from 'react-native';
import { VStack, Text, Box, Flex, Image, Heading, IconButton, Icon, Container, Center, useBreakpointValue, ScrollView } from 'native-base';
import { useQuery } from '../Queries';
import { LoadingView } from '../components/Loading';
import { useNavigation } from '../Navigation';
import API from '../API';
import Artist from '../models/Artist';
import ArtistCard from '../components/ArtistCard';
import CardGridCustom from '../components/CardGridCustom';
import { translate } from '../i18n/i18n';

const colorRange = [
	{
		code: '#364fc7',
	},
	{
		code: '#5c940d',
	},
	{
		code: '#c92a2a',
	},
	{
		code: '#d6336c',
	},
	{
		code: '#20c997'
	}
]

const rockArtists: Artist[] = [
	{
		id: 1,
		name: "Led Zeppelin",
		picture: "https://picsum.photos/200",
	},
	{
		id: 2,
		name: "Queen",
		picture: "https://picsum.photos/200",
	},
	{
		id: 3,
		name: "The Rolling Stones",
		picture: "https://picsum.photos/200",
	},
	{
		id: 4,
		name: "AC/DC",
		picture: "https://picsum.photos/200",
	},
	{
		name: "Guns N' Roses",
		id: 5,
		picture: "https://picsum.photos/200",
	},
];

const GenreDetailsView = ({ genreId }: any) => {
	const { isLoading: isLoadingGenre, data: genreData, error: isErrorGenre } = useQuery(API.getArtist(genreId));
	const screenSize = useBreakpointValue({ base: "small", md: "big" });
	const isMobileView = screenSize == "small";
	const navigation = useNavigation();

	// if (isLoadingGenre) {
	// 	return <LoadingView />;
	// }

	// if (isErrorGenre) {
	// 	navigation.navigate('Error');
	// }

	return (
		<ScrollView>
			<Box
			size={'100%'}
			height={isMobileView ? 200 : 300}
			width={'100%'}
			bg={{
				linearGradient: {
					colors: [colorRange[Math.floor(Math.random() * 5)]?.code ?? '#364fc7', 'black'],
					start: [0, 0],
					end: [0, 1],
				},}}
			/>
			<Flex
				flexWrap="wrap"
				direction={isMobileView ? 'column' : 'row'}
				justifyContent={['flex-start']}
				mt={4}
			>
				<Box>
				{rockArtists?.length ? (
				<CardGridCustom
					content={rockArtists.slice(0, rockArtists.length).map((artistData) => ({
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
				<Box>
					
				</Box>
			</Flex>
		</ScrollView>
);
}

export default GenreDetailsView;