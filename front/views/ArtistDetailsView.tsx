import { Box, Heading, useBreakpointValue, ScrollView } from 'native-base';
import { useQuery } from '../Queries';
import { LoadingView } from '../components/Loading';
import API from '../API';
import Song from '../models/Song';
import SongRow from '../components/SongRow';
import { Key } from 'react';
import { useNavigation } from '../Navigation';
import { ImageBackground } from 'react-native';
import { useLikeSongMutation } from '../utils/likeSongMutation';

type ArtistDetailsViewProps = {
	artistId: number;
};

const ArtistDetailsView = ({ artistId }: ArtistDetailsViewProps) => {
	const artistQuery = useQuery(API.getArtist(artistId));
	const songsQuery = useQuery(API.getSongsByArtist(artistId));
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isMobileView = screenSize == 'small';
	const navigation = useNavigation();

	const favoritesQuery = useQuery(API.getLikedSongs());
	const { mutate } = useLikeSongMutation();

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
				style={{ width: '100%', height: isMobileView ? 200 : 300 }}
				source={{ uri: API.getArtistIllustration(artistQuery.data.id) }}
			></ImageBackground>
			<Box>
				<Heading mt={-20} ml={3} fontSize={50}>
					{artistQuery.data.name}
				</Heading>
				<ScrollView mt={3}>
					<Box>
						{songsQuery.data.map((comp: Song, index: Key | null | undefined) => (
							<SongRow
								key={index}
								song={{ ...comp, artist: artistQuery.data }}
								isLiked={
									!favoritesQuery.data?.find((query) => query?.songId == comp.id)
								}
								handleLike={async (state: boolean, songId: number) =>
									mutate({ songId: songId, like: state })
								}
								onPress={() => {
									API.createSearchHistoryEntry(comp.name, 'song');
									navigation.navigate('Play', { songId: comp.id });
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
