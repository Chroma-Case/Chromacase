import { Box, Image, Heading, useBreakpointValue } from 'native-base';
import { SafeAreaView } from 'react-native';
import { useQuery } from '../Queries';
import { LoadingView } from '../components/Loading';
import API from '../API';
import Song, { SongWithArtist } from '../models/Song';
import SongRow from '../components/SongRow';
import { Key } from 'react';
import { RouteProps, useNavigation } from '../Navigation';

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
		<SafeAreaView>
			<Box>
				<Image
					source={{ uri: 'https://picsum.photos/200' }}
					alt={artistQuery.data.name}
					size={'100%'}
					height={isMobileView ? 200 : 300}
					width={'100%'}
					resizeMode="cover"
				/>
				<Box>
					<Heading m={3}>Abba</Heading>
					<Box>
						{songsQuery.data.map((comp: Song, index: Key | null | undefined) => (
							<SongRow
								key={index}
								song={comp}
								onPress={() => {
									API.createSearchHistoryEntry(comp.name, 'song');
									navigation.navigate('Song', { songId: comp.id });
								}}
							/>
						))}
					</Box>
				</Box>
			</Box>
		</SafeAreaView>
	);
};

export default ArtistDetailsView;
