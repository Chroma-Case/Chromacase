import { Box, useBreakpointValue, useTheme } from 'native-base';
import { LineChart } from 'react-native-chart-kit';
import { CardBorderRadius } from './Card';
import SongHistory from '../models/SongHistory';
import { useState } from 'react';

type ScoreGraphProps = {
	// The result of the call to API.getSongHistory
	songHistory: SongHistory;
};

const formatScoreDate = (playDate: Date): string => {
	const pad = (n: number) => n.toString().padStart(2, '0');
	const formattedDate = `${pad(playDate.getDay())}/${pad(playDate.getMonth())}`;
	const formattedTime = `${pad(playDate.getHours())}:${pad(playDate.getMinutes())}`;
	return `${formattedDate} ${formattedTime}`;
};

const ScoreGraph = (props: ScoreGraphProps) => {
	const theme = useTheme();
	const [containerWidth, setContainerWidth] = useState(0);
	// We sort the scores by date, asc.
	// By default, the API returns them in desc.
	// const pointsToDisplay = props.width / 100;
	const isSmall = useBreakpointValue({ base: true, md: false });
	const scores = props.songHistory.history
		.sort((a, b) => {
			if (a.playDate < b.playDate) {
				return -1;
			} else if (a.playDate > b.playDate) {
				return 1;
			}
			return 0;
		})
		.slice(-10);

	return (
		<Box
			style={{ width: '100%' }}
			onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
		>
			<LineChart
				data={{
					labels: isSmall
						? []
						: scores?.map(({ playDate }) => formatScoreDate(playDate)) ?? [],
					datasets: [
						{
							data: scores?.map(({ score }) => score) ?? [],
						},
					],
				}}
				width={containerWidth}
				height={200} // Completely arbitrary
				yAxisSuffix=" pts"
				chartConfig={{
					backgroundColor: theme.colors.primary[500],
					backgroundGradientFrom: theme.colors.primary[500],
					backgroundGradientTo: theme.colors.primary[500],
					decimalPlaces: 0,
					color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					labelColor: () => theme.colors.white,
					propsForDots: {
						r: '6',
						strokeWidth: '2',
					},
				}}
				bezier
				style={{
					margin: 3,
					shadowColor: theme.colors.primary[400],
					shadowOpacity: 1,
					shadowRadius: 20,
					borderRadius: CardBorderRadius,
				}}
			/>
		</Box>
	);
};

export default ScoreGraph;
