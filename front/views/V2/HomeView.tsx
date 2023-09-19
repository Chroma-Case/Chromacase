import { View } from 'react-native';
import { Text, useBreakpointValue } from 'native-base';
import React from 'react';
import { useQuery } from '../../Queries';
import HomeMainSongCard from '../../components/V2/HomeMainSongCard';
import SongCardInfo from '../../components/V2/SongCardInfo';
import API from '../../API';

const bigSideRatio = 1000;
const smallSideRatio = 618;

type HomeCardProps = {
	image: string;
	title: string;
	artist: string;
};

const cards = [
	{
		image: 'https://media.discordapp.net/attachments/717080637038788731/1153688155292180560/image_homeview1.png',
		title: 'Beethoven',
		artist: 'Synphony No. 9',
	},
	{
		image: 'https://media.discordapp.net/attachments/717080637038788731/1153688154923090093/image_homeview2.png',
		title: 'Mozart',
		artist: 'Lieder Kantate KV 619',
	},
	{
		image: 'https://media.discordapp.net/attachments/717080637038788731/1153688154499457096/image_homeview3.png',
		title: 'Back',
		artist: 'Truc Truc',
	},
	{
		image: 'https://media.discordapp.net/attachments/717080637038788731/1153688154109394985/image_homeview4.png',
		title: 'Mozart',
		artist: 'Machin Machin',
	},
] as [HomeCardProps, HomeCardProps, HomeCardProps, HomeCardProps];

const HomeView = () => {
	const songsQuery = useQuery(API.getSongSuggestions);
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isPhone = screenSize === 'small';

	return (
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
								console.log('SongCardInfo pressed');
							}}
						/>
					))}
				</View>
			</View>
		</View>
	);
};

export default HomeView;
