import { VStack, Text, Box, Image, Heading, IconButton, Icon, Container, Center, useBreakpointValue, ScrollView } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
// import { Box, Image, Heading, useBreakpointValue } from 'native-base';
import { SafeAreaView } from 'react-native';
import { useQuery } from '../Queries';
import { LoadingView } from '../components/Loading';
import API from '../API';
import Song, { SongWithArtist } from '../models/Song';
import SongRow from '../components/SongRow';
import { Key } from 'react';
import { RouteProps, useNavigation } from '../Navigation';
import { ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type ArtistDetailsViewProps = {
	artistId: number;
};

const ArtistDetailsView = ({ artistId }: RouteProps<ArtistDetailsViewProps>) => {
	const artistQuery = useQuery(API.getArtist(artistId));
	const songsQuery = useQuery(API.getSongsByArtist(artistId));
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isMobileView = screenSize == 'small';
	const navigation = useNavigation();

	if (artistQuery.isError || songsQuery.isError) {
		navigation.navigate('Error');
		return <></>;
	}
	if (!artistQuery.data || songsQuery.data === undefined) {
		return <LoadingView />;
	}

	return (
		<ScrollView>
			<ImageBackground
				style={{width : '100%', height: isMobileView ? 200 : 300}}
				source={{uri : "https://picsum.photos/720"}}>
				<LinearGradient 
					colors={['#00000000', '#000000']} 
					style={{height : '100%', width : '100%'}}/>
			</ImageBackground>
			<Box>
				<Heading mt={-20} ml={3} fontSize={50}>{artistQuery.data.name}</Heading>
				<ScrollView mt={3}>
					<Box>
						{songsQuery.data.map((comp: Song, index: Key | null | undefined) => (
							<SongRow
								key={index}
								song={comp}
								liked={true}
								onPress={() => {
									API.createSearchHistoryEntry(comp.name, 'song');
									navigation.navigate('Song', { songId: comp.id });
								}}
							/>
						))}
					</Box>
				</ScrollView>
			</Box>
		</ScrollView>
	);
};

export default ArtistDetailsView;
