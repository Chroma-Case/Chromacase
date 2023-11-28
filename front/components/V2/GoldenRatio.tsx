import React from 'react';
import { View } from 'react-native';
import { useBreakpointValue } from 'native-base';
import HomeMainSongCard from './HomeMainSongCard';
import GoldenRatioPanel from './GoldenRatioPanel';

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
		<GoldenRatioPanel
			direction={isPhone ? 'column' : 'row'}
			header={<HomeMainSongCard {...cards[0]} />}
		>
			<GoldenRatioPanel
				direction={isPhone ? 'row' : 'column'}
				header={<HomeMainSongCard {...cards[1]} />}
			>
				<GoldenRatioPanel
					direction={isPhone ? 'column-reverse' : 'row-reverse'}
					header={<HomeMainSongCard {...cards[2]} />}
				>
					<GoldenRatioPanel
						direction={isPhone ? 'row-reverse' : 'column-reverse'}
						header={<HomeMainSongCard {...cards[3]} />}
					>
						<View style={{ display: 'flex', width: '100%', height: '100%'}}>
						</View>
					</GoldenRatioPanel>
				</GoldenRatioPanel>
			</GoldenRatioPanel>
		</GoldenRatioPanel>
	);
};

export default GoldenRatio;
