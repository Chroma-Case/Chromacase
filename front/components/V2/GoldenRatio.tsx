import React from 'react';
import { View } from 'react-native';
import { useBreakpointValue } from 'native-base';
import HomeMainSongCard from './HomeMainSongCard';

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

const GoldenRatio = () => {
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isPhone = screenSize === 'small';
	return (
		<View
			style={{
				alignSelf: 'stretch',
				maxWidth: 1100,
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
	);
};

export default GoldenRatio;
