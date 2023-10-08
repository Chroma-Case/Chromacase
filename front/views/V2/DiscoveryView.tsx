import { View } from 'react-native';
import { Text, useBreakpointValue } from 'native-base';
import React from 'react';
import { useQuery, useQueries } from '../../Queries';
import HomeMainSongCard from '../../components/V2/HomeMainSongCard';
import SongCardInfo from '../../components/V2/SongCardInfo';
import API from '../../API';
import { RouteProps, useNavigation } from '../../Navigation';
import ScaffoldCC from '../../components/UI/ScaffoldCC';

const bigSideRatio = 1000;
const smallSideRatio = 618;

type HomeCardProps = {
	image: string;
	title: string;
	artist: string;
	fontSize: number;
	onPress?: () => void;
};

const cards = [
	{
		image: 'https://media.discordapp.net/attachments/717080637038788731/1153688155292180560/image_homeview1.png',
		title: 'Beethoven',
		artist: 'Synphony No. 9',
		fontSize: 46,
	},
	{
		image: 'https://media.discordapp.net/attachments/717080637038788731/1153688154923090093/image_homeview2.png',
		title: 'Mozart',
		artist: 'Lieder Kantate KV 619',
		fontSize: 36,
	},
	{
		image: 'https://media.discordapp.net/attachments/717080637038788731/1153688154499457096/image_homeview3.png',
		title: 'Back',
		artist: 'Truc Truc',
		fontSize: 26,
	},
	{
		image: 'https://media.discordapp.net/attachments/717080637038788731/1153688154109394985/image_homeview4.png',
		title: 'Mozart',
		artist: 'Machin Machin',
		fontSize: 22,
	},
] as [HomeCardProps, HomeCardProps, HomeCardProps, HomeCardProps];

const HomeView = (props: RouteProps<{}>) => {
	const songsQuery = useQuery(API.getSongSuggestions);
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isPhone = screenSize === 'small';
	const navigation = useNavigation();
	const artistsQueries = useQueries(
		(songsQuery.data ?? []).map((song) => API.getArtist(song.artistId))
	);

	React.useEffect(() => {
		if (!songsQuery.data) return;
		if (artistsQueries.every((query) => !query.isLoading)) return;

		(songsQuery.data ?? [])
			.filter((song) =>
				artistsQueries.find((artistQuery) => artistQuery.data?.id === song.artistId)
			)
			.forEach((song, index) => {
				if (index > 3) return;
				cards[index]!.image = song.cover;
				cards[index]!.title = song.name;
				cards[index]!.artist = artistsQueries.find(
					(artistQuery) => artistQuery.data?.id === song.artistId
				)!.data!.name;
				cards[index]!.onPress = () => {
					navigation.navigate('Song', { songId: song.id });
				};
			});
	}, [artistsQueries]);

	return (
		<ScaffoldCC routeName={props.route.name}>
			<View
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<View>
					<View
						style={{
							alignSelf: 'stretch',
							maxWidth: '1100px',
							alignItems: 'stretch',
							flexDirection: isPhone ? 'column' : 'row',
						}}
					>
						<View
							style={{
								flexGrow: bigSideRatio,
							}}
						>
							<HomeMainSongCard {...cards[0]} />
						</View>
						<View
							style={{
								flexGrow: smallSideRatio,
								display: 'flex',
								flexDirection: isPhone ? 'row' : 'column',
								alignItems: 'stretch',
							}}
						>
							<View
								style={{
									flexGrow: bigSideRatio,
								}}
							>
								<HomeMainSongCard {...cards[1]} />
							</View>
							<View
								style={{
									flexGrow: smallSideRatio,
									display: 'flex',
									flexDirection: isPhone ? 'column-reverse' : 'row-reverse',
									alignItems: 'stretch',
								}}
							>
								<View
									style={{
										flexGrow: bigSideRatio,
									}}
								>
									<HomeMainSongCard {...cards[2]} />
								</View>
								<View
									style={{
										flexGrow: smallSideRatio,
										display: 'flex',
										flexDirection: isPhone ? 'row-reverse' : 'column-reverse',
										alignItems: 'stretch',
									}}
								>
									<View
										style={{
											flexGrow: bigSideRatio,
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'stretch',
											justifyContent: 'flex-end',
										}}
									>
										<HomeMainSongCard {...cards[3]} />
									</View>
									<View
										style={{
											flexGrow: smallSideRatio,
										}}
									></View>
								</View>
							</View>
						</View>
					</View>
				</View>
				<View
					style={{
						flexShrink: 0,
						flexGrow: 0,
						flexBasis: '15%',
						width: '100%',
					}}
				>
					<Text
						style={{
							color: 'white',
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
					<View
						style={{
							flexDirection: 'row',
							flexWrap: 'wrap',
							justifyContent: 'flex-start',
							alignItems: 'flex-start',
							// @ts-expect-error - gap is not in the typings
							gap: 16,
						}}
					>
						{songsQuery.data?.map((song) => (
							<SongCardInfo
								key={song.id}
								song={song}
								onPress={() => {
									navigation.navigate('Song', { songId: song.id });
								}}
								onPlay={() => {
									console.log('play');
								}}
							/>
						))}
					</View>
				</View>
			</View>
		</ScaffoldCC>
	);
};

export default HomeView;
