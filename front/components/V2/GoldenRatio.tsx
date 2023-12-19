import React from 'react';
import { View } from 'react-native';
import { useBreakpointValue } from 'native-base';
import HomeMainSongCard from './HomeMainSongCard';
import GoldenRatioPanel from './GoldenRatioPanel';
import Song from '../../models/Song';
import { useNavigation } from '../../Navigation';

type GoldenRatioProps = {
	songs: Song[];
};

const GoldenRatio = (props: GoldenRatioProps) => {
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isPhone = screenSize === 'small';
	const navigation = useNavigation();
	const fontSizes = [46, 36, 26, 22];
	const cards = props.songs.map((s, i) => ({
		image: s.cover,
		title: s.name,
		artist: s.artist?.name ?? '',
		fontSize: fontSizes.at(i) ?? fontSizes.at(-1)!,
		onPress: () => navigation.navigate('Play', { songId: s.id }),
	}));

	return (
		<GoldenRatioPanel
			direction={isPhone ? 'column' : 'row'}
			header={<HomeMainSongCard {...cards[0]!} />}
		>
			<GoldenRatioPanel
				direction={isPhone ? 'row' : 'column'}
				header={<HomeMainSongCard {...cards[1]!} />}
			>
				<GoldenRatioPanel
					direction={isPhone ? 'column-reverse' : 'row-reverse'}
					header={<HomeMainSongCard {...cards[2]!} />}
				>
					<GoldenRatioPanel
						direction={isPhone ? 'row-reverse' : 'column-reverse'}
						header={<HomeMainSongCard numLinesHeader={1} {...cards[3]!} />}
					>
						<View style={{ display: 'flex', width: '100%', height: '100%' }}></View>
					</GoldenRatioPanel>
				</GoldenRatioPanel>
			</GoldenRatioPanel>
		</GoldenRatioPanel>
	);
};

export default GoldenRatio;
