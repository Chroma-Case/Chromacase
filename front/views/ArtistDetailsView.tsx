import { VStack, Text, Box, Image, Heading, IconButton, Icon, Container, Center, useBreakpointValue } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import { useQuery } from '../Queries';
import { LoadingView } from '../components/Loading';
import API from '../API';
import Song, { SongWithArtist } from '../models/Song';
import SongRow from '../components/SongRow';
import { Key, useEffect, useState } from 'react';
import { useNavigation } from '../Navigation';

const ArtistDetailsView = ({ artistId }: any) => {
	const { isLoading, data: artistData, isError } = useQuery(API.getArtist(artistId));
	// const { isLoading: isLoadingSongs, data: songData = [], error: errorSongs } = useQuery(['songs', artistId], () => API.getSongsByArtist(artistId))
	const screenSize = useBreakpointValue({ base: "small", md: "big" });
	const isMobileView = screenSize == "small";
	const navigation = useNavigation();
	const [merde, setMerde] = useState<any>(null);

	useEffect(() => {
		// Code to be executed when the component is focused
		console.warn('Component focused!');
		setMerde(API.getSongsByArtist(112));
		// Call your function or perform any other actions here
	}, []);

	if (isLoading) {
		return <LoadingView />;
	}

	if (isError) {
		navigation.navigate('Error');
	}

	return (
		<SafeAreaView>
			<Box>
				<Image
				source={{ uri: 'https://picsum.photos/200' }}
				alt={artistData?.name}
				size={'100%'}
				height={isMobileView ? 200 : 300}
				width={'100%'}
				resizeMode='cover'
				/>
				<Box>
					<Heading m={3} >Abba</Heading>
					<Box>
						{merde.map((comp: Song | SongWithArtist, index: Key | null | undefined) => (
							<SongRow
								key={index}
								song={comp}
								onPress={() => {
									API.createSearchHistoryEntry(comp.name, "song", Date.now());
									navigation.navigate("Song", { songId: comp.id });
								}}
							/>
							))
						}
					</Box>
				</Box>
			</Box>
		</SafeAreaView>
	);
};

export default ArtistDetailsView;
