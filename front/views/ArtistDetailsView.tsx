import { VStack, Text, Box, Image, Heading, IconButton, Icon, Container, Center, useBreakpointValue, ScrollView } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import { useQuery } from '../Queries';
import { LoadingView } from '../components/Loading';
import API from '../API';
import Song, { SongWithArtist } from '../models/Song';
import SongRow from '../components/SongRow';
import { Key, useEffect, useState } from 'react';
import { useNavigation } from '../Navigation';

const songs: Song[] = [
	{
		id: 1,
		name: "Dancing Queen",
		artistId: 1,
		albumId: 1,
		genreId: 1,
		cover: undefined,
		details: undefined,
	},
	{
		id: 2,
		name: "Mamma Mia",
		artistId: 1,
		albumId: 1,
		genreId: 1,
		cover: undefined,
		details: undefined,
	},
	{
		id: 3,
		name: "Take a Chance on Me",
		artistId: 1,
		albumId: 2,
		genreId: 1,
		cover: undefined,
		details: undefined,
	},
	{
		id: 4,
		name: "Fernando",
		artistId: 1,
		albumId: 3,
		genreId: 1,
		cover: undefined,
		details: undefined,
	},
	{
		id: 5,
		name: "Waterloo",
		artistId: 1,
		albumId: 4,
		genreId: 1,
		cover: undefined,
		details: undefined,
	},
	{
		id: 6,
		name: "The Winner Takes It All",
		artistId: 1,
		albumId: 5,
		genreId: 1,
		cover: undefined,
		details: undefined,
	},
	{
		id: 7,
		name: "SOS",
		artistId: 1,
		albumId: 6,
		genreId: 1,
		cover: undefined,
		details: undefined,
	},
	{
		id: 8,
		name: "Knowing Me, Knowing You",
		artistId: 1,
		albumId: 7,
		genreId: 1,
		cover: undefined,
		details: undefined,
	},
	{
		id: 9,
		name: "Money, Money, Money",
		artistId: 1,
		albumId: 8,
		genreId: 1,
		cover: undefined,
		details: undefined,
	},
	{
		id: 10,
		name: "Gimme! Gimme! Gimme! (A Man After Midnight)",
		artistId: 1,
		albumId: 9,
		genreId: 1,
		cover: undefined,
		details: undefined,
	},
];

const ArtistDetailsView = ({ artistId }: any) => {
	const { isLoading: isLoadingArt, data: artistData, error: isErrorArt } = useQuery(API.getArtist(artistId));
	const { isLoading: isLoadingSong, data: songData = [], error: isErrorSong } = useQuery(API.getSongsByArtist(artistId));
	const screenSize = useBreakpointValue({ base: "small", md: "big" });
	const isMobileView = screenSize == "small";
	const navigation = useNavigation();

	if (isLoadingArt) {
		return <LoadingView />;
	}

	if (isErrorArt) {
		navigation.navigate('Error');
	}

	return (
		<ScrollView>
			<Box>
				<Image
				source={{ uri: 'https://picsum.photos/720' }}
				alt={artistData?.name}
				size={'100%'}
				height={isMobileView ? 200 : 300}
				width={'100%'}
				resizeMode='cover'
				/>
				<Box>
					<Heading mt={-20} ml={3} fontSize={50}>{artistData?.name}</Heading>
					<ScrollView mt={3}>
						{songs.map((comp: Song | SongWithArtist, index: Key | null | undefined) => (
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
					</ScrollView>
				</Box>
			</Box>
		</ScrollView>
	);
};

export default ArtistDetailsView;
