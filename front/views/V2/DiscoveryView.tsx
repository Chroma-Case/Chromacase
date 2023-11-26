import { View } from 'react-native';
import { Text, useBreakpointValue } from 'native-base';
import React from 'react';
import { useQuery, useQueries } from '../../Queries';
import SongCardInfo from '../../components/V2/SongCardInfo';
import API from '../../API';
import { RouteProps, useNavigation } from '../../Navigation';
import ScaffoldCC from '../../components/UI/ScaffoldCC';
import GoldenRatio from '../../components/V2/GoldenRatio';

// eslint-disable-next-line @typescript-eslint/ban-types
const HomeView = (props: RouteProps<{}>) => {
	const songsQuery = useQuery(API.getSongSuggestions);
	const navigation = useNavigation();
	const artistsQueries = useQueries(
		(songsQuery.data ?? []).map((song) => API.getArtist(song.artistId))
	);

	// React.useEffect(() => {
	// 	if (!songsQuery.data) return;
	// 	if (artistsQueries.every((query) => !query.isLoading)) return;

	// 	(songsQuery.data ?? [])
	// 		.filter((song) =>
	// 			artistsQueries.find((artistQuery) => artistQuery.data?.id === song.artistId)
	// 		)
	// 		.forEach((song, index) => {
	// 			if (index > 3) return;
	// 			cards[index]!.image = song.cover;
	// 			cards[index]!.title = song.name;
	// 			cards[index]!.artist = artistsQueries.find(
	// 				(artistQuery) => artistQuery.data?.id === song.artistId
	// 			)!.data!.name;
	// 			cards[index]!.onPress = () => {
	// 				navigation.navigate('Play', { songId: song.id });
	// 			};
	// 		});
	// }, [artistsQueries]);

	return (
		// <ScaffoldCC routeName={props.route.name}>
		<View
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<View
				style={{
					width: '100%',
					maxWidth: 1100,
					// maxHeight: 500,
					// aspectRatio: 1.618,
					// golden ratio in vertical
					aspectRatio: 0.618,
				}}
			>
				<GoldenRatio />
			</View>
			<View
				style={{
					flexDirection: 'column',
					flexWrap: 'wrap',
					justifyContent: 'flex-start',
					alignItems: 'flex-start',
					gap: 16,
				}}
			>
				<Text
					style={{
						fontSize: 24,
						fontWeight: 'bold',
						marginLeft: 16,
						marginBottom: 16,
						marginTop: 24,
					}}
				>
					{'Suggestions'}
				</Text>
				{songsQuery.isLoading && <Text>Loading...</Text>}
				{/* <View
					style={{
						flexDirection: 'row',
						flexWrap: 'wrap',
						justifyContent: 'flex-start',
						alignItems: 'flex-start',
						gap: 16,
					}}
				>
					{songsQuery.data?.map((song) => (
						<SongCardInfo
							key={song.id}
							song={song}
							onPress={() => {
								navigation.navigate('Play', { songId: song.id });
							}}
							onPlay={() => {
								console.log('play');
							}}
						/>
					))}
				</View> */}
			</View>
		</View>
		// </ScaffoldCC>
	);
};

export default HomeView;
