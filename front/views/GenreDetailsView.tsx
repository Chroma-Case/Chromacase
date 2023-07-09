import { SafeAreaView } from 'react-native';
import { VStack, Text, Box, Flex, Image, Heading, IconButton, Icon, Container, Center, useBreakpointValue, ScrollView } from 'native-base';
import { useQuery } from '../Queries';
import { LoadingView } from '../components/Loading';
import { useNavigation } from '../Navigation';
import API from '../API';
import Artist from '../models/Artist';

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

const rockSongs: Song[] = [
	{
		id: 1,
		name: "Stairway to Heaven",
		artistId: 1,
		albumId: 1,
		genreId: 1,
		cover: "https://picsum.photos/200",
		details: { /* song details */ },
	},
	{
		id: 2,
		name: "Bohemian Rhapsody",
		artistId: 2,
		albumId: 2,
		genreId: 1,
		cover: "https://picsum.photos/200",
		details: { /* song details */ },
	},
	{
		id: 3,
		name: "Paint It Black",
		artistId: 3,
		albumId: 3,
		genreId: 1,
		cover: "https://picsum.photos/200",
		details: { /* song details */ },
	},
	{
		id: 4,
		name: "Highway to Hell",
		artistId: 4,
		albumId: 4,
		genreId: 1,
		cover: "https://picsum.photos/200",
		details: { /* song details */ },
	},
	{
		id: 5,
		name: "Sweet Child o' Mine",
		artistId: 5,
		albumId: 5,
		genreId: 1,
		cover: "https://picsum.photos/200",
		details: { /* song details */ },
	},
	// Add more songs as needed
  ];

const GenreDetailsView = ({ genreId }: any) => {
	// const { isLoading: isLoadingGenre, data: genreData, error: isErrorGenre } = useQuery(API.getArtist(genreId));
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
			backgroundColor={'#20c997'}
			/>
			<Flex
				flexWrap="wrap"
				direction={isMobileView ? 'column' : 'row'}
				justifyContent={['flex-start']}
				mt={4}
			>
				<Box>
					
				</Box>
				<Box>
					
				</Box>
			</Flex>
		</ScrollView>
);
}

export default GenreDetailsView;