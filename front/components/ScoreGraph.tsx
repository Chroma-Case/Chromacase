import { useTheme } from 'native-base';
import { LineChart } from 'react-native-chart-kit';
import { CardBorderRadius } from './Card';
import SongHistory from '../models/SongHistory';

type ScoreGraphProps = {
	// Actual width of the component
	// Required by the underlying library
	width: number;
	// The result of the call to API.getSongHistory
	songHistory: SongHistory;
};

const formatScoreDate = (playDate: Date): string => {
	const pad = (n: number) => n.toString().padStart(2, '0');
	const formattedDate = `${pad(playDate.getDay())}/${pad(
		playDate.getMonth()
	)}/${playDate.getFullYear()}`;
	const formattedTime = `${pad(playDate.getHours())}:${pad(playDate.getMinutes())}`;
	return `${formattedDate} ${formattedTime}`;
};

const ScoreGraph = (props: ScoreGraphProps) => {
	const theme = useTheme();
	// We sort the scores by date, asc.
	// By default, the API returns them in desc.
	const scores = props.songHistory.history.sort((a, b) => {
		if (a.playDate < b.playDate) {
			return -1;
		} else if (a.playDate > b.playDate) {
			return 1;
		}
		return 0;
	});

	return (
		<LineChart
			data={{
				labels: scores?.map(({ playDate }) => formatScoreDate(playDate)) ?? [],
				datasets: [
					{
						data: scores?.map(({ score }) => score) ?? [],
					},
				],
			}}
			width={props.width}
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
	);
};

export default ScoreGraph;
