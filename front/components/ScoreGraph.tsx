import {
	Box,
	Flex,
	Select,
	useBreakpointValue,
	useTheme,
	Wrap,
} from 'native-base';
import { LineChart } from 'react-native-chart-kit';
import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useQuery } from '../Queries';
import API from '../API';
import { LoadingView } from './Loading';

const formatScoreDate = (playDate: Date): string => {
	// const formattedDate = `${pad(playDate.getDay())}/${pad(playDate.getMonth())}`;
	// const formattedTime = `${pad(playDate.getHours())}:${pad(playDate.getMinutes())}`;
	
	// console.log(playDate.toDateString());
	// console.log(`${playDate.getDate()}/${playDate.getMonth() + 1}`);
	return `${playDate.getDate()}`;
};

type GraphProps = {
	songId: number,
	since: Date
};

const calculateDailyAverages = (scores: { playDate: Date, score: number }[]): { playDate: Date, score: number }[] => {
    const dailyScores: { [key: string]: number[] } = {};

    // Regroupez les scores par date
    scores.forEach((score) => {
        const date = score.playDate.toISOString().split('T')[0] as string; // Obtenez la date au format 'YYYY-MM-DD'
        if (!dailyScores[date]) {
            dailyScores[date] = [];
        }
        dailyScores[date]!.push(score.score);
    });

    // Calculez la moyenne des scores par jour et créez un tableau d'objets avec le format final
    const dailyAverages: { playDate: Date, score: number }[] = [];
    Object.keys(dailyScores).forEach((date) => {
        const oneDayScore = dailyScores[date];
		if (oneDayScore) {
			const average = oneDayScore.reduce((total, score) => total + score, 0) / oneDayScore.length;
			dailyAverages.push({ playDate: new Date(date), score: average });
		}
    });

    return dailyAverages;
};

const Graph = ({songId, since}: GraphProps) => {
	const isSmall = useBreakpointValue({ base: true, md: false });
	const theme = useTheme();
	const [containerWidth, setContainerWidth] = useState(0);
	const scoresQuery = useQuery(API.getSongHistory(songId), { refetchOnWindowFocus: true });

	if (!scoresQuery.data) {
		return <LoadingView />;
	}

	const dailyScore = calculateDailyAverages(scoresQuery.data.history);
	const scoresToSort = dailyScore
		.filter((item: { playDate: Date; }) => item.playDate >= since);

	const scores = scoresToSort.sort((a, b) => {
		if (a.playDate < b.playDate) {
			return -1;
		} else if (a.playDate > b.playDate) {
			return 1;
		}
		return 0;
	});
	console.log(scores);

	return (
		<Box
			style={{ width: '100%', marginTop: 20 }}
			onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
		>
			{scores && scores.length > 0 &&
				<LineChart
					data={{
						labels: isSmall ? [] : scores.map(({ playDate }) => formatScoreDate(playDate)),
						datasets: [
							{
								data: scores.map(({ score }) => score),
							},
						],
					}}
					width={containerWidth}
					height={300} // Completely arbitrary
					transparent={true}
					yAxisSuffix=" pts"
					chartConfig={{
						propsForLabels: {
							fontFamily: 'Lexend',
						},
						// propsForVerticalLabels: {
						// 	rotation: -90,
						// },
						propsForBackgroundLines: {
							strokeDasharray: '',
							strokeWidth: '1',
							color: '#fff000',
						},
						decimalPlaces: 0,
						color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						labelColor: () => theme.colors.white,
						propsForDots: {
							r: '6',
							strokeWidth: '2',
						},
					}}
					bezier
				/>
			}
		</Box>
	);
}

const ScoreGraph = () => {
	const layout = useWindowDimensions();
	const songs = useQuery(API.getAllSongs);
	const rangeOptions = [
		{ label: '3 derniers jours', value: '3days' },
		{ label: 'Dernière semaine', value: 'week' },
		{ label: 'Dernier mois', value: 'month' },
	];
	const { colors } = useTheme();

	const threeDaysAgo = new Date();
	threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
	const oneWeekAgo = new Date();
	oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
	const oneMonthAgo = new Date();
	oneMonthAgo.setDate(1);

	const [selectedSinceDate, setSelectedSinceDate] = useState(threeDaysAgo);
	const [selectedSong, setSelectedSong] = useState<number | undefined>(0);

	if (!songs.data) {
		return <LoadingView />;
	}

	const setSelectedRange = (selectedRange: string) => {
		switch (selectedRange) {
			case 'week':
				setSelectedSinceDate(oneWeekAgo);
				break;
			case 'month':
				setSelectedSinceDate(oneMonthAgo);
				break;
			default:
				setSelectedSinceDate(threeDaysAgo);
				break;
		}
	}

	return (
		<Flex flex={1}>
			<Wrap style={{gap: 16, flexDirection: 'row', justifyContent: 'flex-end'}}>
				<Box>
					<Select
						onValueChange={(selectedValue) => setSelectedSong(songs.data.find(song => selectedValue === song.name)?.id)}
						defaultValue={songs.data.at(0)?.name}
						bgColor={colors.coolGray[500]}
						variant="filled"
						width={layout.width > 650 ? '200' : '150'}
					>
						{songs.data.map((option) => (
							<Select.Item
								key={option.id}
								label={option.name}
								value={option.name}
							/>
						))}
					</Select>
				</Box>
				<Box>
					<Select
						onValueChange={(itemValue) => setSelectedRange(itemValue)}
						defaultValue={'3days'}
						bgColor={colors.coolGray[500]}
						variant="filled"
						width={layout.width > 650 ? '200' : '150'}
					>
						{rangeOptions.map((option) => (
							<Select.Item
								key={option.label}
								label={option.label}
								value={option.value}
							/>
						))}
					</Select>
				</Box>
			</Wrap>
			{selectedSong !== undefined &&
				<Graph
					songId={selectedSong}
					since={selectedSinceDate}
				/>
			}
		</Flex>
	);
};

export default ScoreGraph;
