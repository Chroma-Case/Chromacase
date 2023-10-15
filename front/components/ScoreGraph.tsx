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

const fakeData = [
	{
		score: 47,
		songID: 34,
		userID: 18,
		playDate: new Date('2023-10-20 8:27:21'),
		difficulties: 1,
	},
	{
		score: 1,
		songID: 603,
		userID: 18,
		playDate: new Date('2023-09-13 22:56:45'),
		difficulties: 1,
	},
	{
		score: 93,
		songID: 601,
		userID: 18,
		playDate: new Date('2023-10-11 5:30:13'),
		difficulties: 5,
	},
	{
		score: 55,
		songID: 456,
		userID: 18,
		playDate: new Date('2023-09-10 23:06:09'),
		difficulties: 4,
	},
	{
		score: 2,
		songID: 345,
		userID: 18,
		playDate: new Date('2023-09-23 18:33:24'),
		difficulties: 2,
	},
	{
		score: 47,
		songID: 625,
		userID: 18,
		playDate: new Date('2023-09-09 7:16:46'),
		difficulties: 1,
	},
	{
		score: 27,
		songID: 234,
		userID: 18,
		playDate: new Date('2023-09-06 15:56:53'),
		difficulties: 5,
	},
	{
		score: 85,
		songID: 866,
		userID: 18,
		playDate: new Date('2023-09-08 8:56:44'),
		difficulties: 2,
	},
	{
		score: 28,
		songID: 484,
		userID: 18,
		playDate: new Date('2023-09-12 6:05:32'),
		difficulties: 4,
	},
	{
		score: 5,
		songID: 443,
		userID: 18,
		playDate: new Date('2023-10-01 11:57:09'),
		difficulties: 3,
	},
	{
		score: 14,
		songID: 109,
		userID: 18,
		playDate: new Date('2023-09-03 22:54:07'),
		difficulties: 3,
	},
	{
		score: 57,
		songID: 892,
		userID: 18,
		playDate: new Date('2023-09-13 23:22:34'),
		difficulties: 5,
	},
	{
		score: 7,
		songID: 164,
		userID: 18,
		playDate: new Date('2023-09-02 0:15:13'),
		difficulties: 2,
	},
	{
		score: 42,
		songID: 761,
		userID: 18,
		playDate: new Date('2023-09-10 18:25:19'),
		difficulties: 3,
	},
	{
		score: 49,
		songID: 82,
		userID: 18,
		playDate: new Date('2023-09-12 12:51:15'),
		difficulties: 4,
	},
	{
		score: 83,
		songID: 488,
		userID: 18,
		playDate: new Date('2023-10-28 7:56:31'),
		difficulties: 5,
	},
	{
		score: 91,
		songID: 648,
		userID: 18,
		playDate: new Date('2023-09-21 10:16:33'),
		difficulties: 4,
	},
	{
		score: 67,
		songID: 210,
		userID: 18,
		playDate: new Date('2023-09-14 8:04:50'),
		difficulties: 1,
	},
	{
		score: 31,
		songID: 274,
		userID: 18,
		playDate: new Date('2023-09-10 11:24:28'),
		difficulties: 4,
	},
	{
		score: 29,
		songID: 930,
		userID: 18,
		playDate: new Date('2023-10-06 0:05:43'),
		difficulties: 5,
	},
	{
		score: 51,
		songID: 496,
		userID: 18,
		playDate: new Date('2023-10-14 9:43:14'),
		difficulties: 1,
	},
	{
		score: 56,
		songID: 370,
		userID: 18,
		playDate: new Date('2023-10-18 19:25:59'),
		difficulties: 2,
	},
	{
		score: 29,
		songID: 333,
		userID: 18,
		playDate: new Date('2023-09-11 4:26:44'),
		difficulties: 4,
	},
	{
		score: 95,
		songID: 921,
		userID: 18,
		playDate: new Date('2023-10-30 12:58:50'),
		difficulties: 1,
	},
	{
		score: 37,
		songID: 80,
		userID: 18,
		playDate: new Date('2023-09-16 7:17:57'),
		difficulties: 4,
	},
	{
		score: 90,
		songID: 134,
		userID: 18,
		playDate: new Date('2023-09-03 9:00:04'),
		difficulties: 1,
	},
	{
		score: 51,
		songID: 497,
		userID: 18,
		playDate: new Date('2023-09-31 19:34:43'),
		difficulties: 4,
	},
	{
		score: 95,
		songID: 368,
		userID: 18,
		playDate: new Date('2023-09-12 20:12:50'),
		difficulties: 4,
	},
	{
		score: 55,
		songID: 247,
		userID: 18,
		playDate: new Date('2023-09-16 2:45:13'),
		difficulties: 1,
	},
	{
		score: 26,
		songID: 725,
		userID: 18,
		playDate: new Date('2023-09-28 22:59:31'),
		difficulties: 2,
	},
	{
		score: 82,
		songID: 952,
		userID: 18,
		playDate: new Date('2023-10-01 6:31:47'),
		difficulties: 1,
	},
	{
		score: 88,
		songID: 85,
		userID: 18,
		playDate: new Date('2023-10-12 2:33:11'),
		difficulties: 5,
	},
	{
		score: 12,
		songID: 96,
		userID: 18,
		playDate: new Date('2023-09-03 14:00:33'),
		difficulties: 4,
	},
	{
		score: 100,
		songID: 807,
		userID: 18,
		playDate: new Date('2023-09-03 0:53:11'),
		difficulties: 3,
	},
	{
		score: 88,
		songID: 456,
		userID: 18,
		playDate: new Date('2023-10-06 9:17:15'),
		difficulties: 5,
	},
	{
		score: 10,
		songID: 889,
		userID: 18,
		playDate: new Date('2023-10-15 12:19:16'),
		difficulties: 3,
	},
	{
		score: 76,
		songID: 144,
		userID: 18,
		playDate: new Date('2023-09-10 2:56:49'),
		difficulties: 4,
	},
	{
		score: 60,
		songID: 808,
		userID: 18,
		playDate: new Date('2023-09-24 10:22:33'),
		difficulties: 1,
	},
	{
		score: 94,
		songID: 537,
		userID: 18,
		playDate: new Date('2023-10-03 23:22:29'),
		difficulties: 2,
	},
	{
		score: 100,
		songID: 465,
		userID: 18,
		playDate: new Date('2023-09-16 19:12:58'),
		difficulties: 2,
	},
	{
		score: 85,
		songID: 31,
		userID: 18,
		playDate: new Date('2023-10-17 5:29:49'),
		difficulties: 2,
	},
	{
		score: 98,
		songID: 345,
		userID: 18,
		playDate: new Date('2023-09-11 1:51:49'),
		difficulties: 1,
	},
	{
		score: 81,
		songID: 204,
		userID: 18,
		playDate: new Date('2023-10-21 2:46:56'),
		difficulties: 2,
	},
	{
		score: 21,
		songID: 40,
		userID: 18,
		playDate: new Date('2023-09-27 4:00:00'),
		difficulties: 2,
	},
	{
		score: 91,
		songID: 274,
		userID: 18,
		playDate: new Date('2023-09-14 16:09:49'),
		difficulties: 5,
	},
	{
		score: 99,
		songID: 416,
		userID: 18,
		playDate: new Date('2023-10-27 1:56:16'),
		difficulties: 5,
	},
	{
		score: 58,
		songID: 87,
		userID: 18,
		playDate: new Date('2023-09-08 19:30:20'),
		difficulties: 5,
	},
	{
		score: 90,
		songID: 744,
		userID: 18,
		playDate: new Date('2023-10-18 23:47:55'),
		difficulties: 2,
	},
	{
		score: 69,
		songID: 954,
		userID: 18,
		playDate: new Date('2023-10-07 1:55:52'),
		difficulties: 5,
	},
	{
		score: 75,
		songID: 467,
		userID: 18,
		playDate: new Date('2023-09-10 8:37:22'),
		difficulties: 4,
	},
	{
		score: 41,
		songID: 693,
		userID: 18,
		playDate: new Date('2023-09-11 5:15:16'),
		difficulties: 2,
	},
	{
		score: 56,
		songID: 140,
		userID: 18,
		playDate: new Date('2023-10-06 5:32:46'),
		difficulties: 2,
	},
	{
		score: 88,
		songID: 64,
		userID: 18,
		playDate: new Date('2023-09-31 20:24:30'),
		difficulties: 1,
	},
	{
		score: 99,
		songID: 284,
		userID: 18,
		playDate: new Date('2023-10-07 17:51:19'),
		difficulties: 5,
	},
	{
		score: 47,
		songID: 746,
		userID: 18,
		playDate: new Date('2023-09-18 17:45:56'),
		difficulties: 5,
	},
	{
		score: 80,
		songID: 791,
		userID: 18,
		playDate: new Date('2023-10-21 1:19:45'),
		difficulties: 1,
	},
	{
		score: 21,
		songID: 748,
		userID: 18,
		playDate: new Date('2023-09-04 9:09:27'),
		difficulties: 4,
	},
	{
		score: 75,
		songID: 541,
		userID: 18,
		playDate: new Date('2023-09-19 23:08:05'),
		difficulties: 2,
	},
	{
		score: 31,
		songID: 724,
		userID: 18,
		playDate: new Date('2023-09-09 2:01:29'),
		difficulties: 4,
	},
	{
		score: 24,
		songID: 654,
		userID: 18,
		playDate: new Date('2023-09-04 1:27:00'),
		difficulties: 1,
	},
	{
		score: 55,
		songID: 154,
		userID: 18,
		playDate: new Date('2023-09-10 17:48:17'),
		difficulties: 3,
	},
	{
		score: 4,
		songID: 645,
		userID: 18,
		playDate: new Date('2023-09-11 18:51:11'),
		difficulties: 2,
	},
	{
		score: 52,
		songID: 457,
		userID: 18,
		playDate: new Date('2023-09-30 19:12:52'),
		difficulties: 3,
	},
	{
		score: 68,
		songID: 236,
		userID: 18,
		playDate: new Date('2023-10-08 8:56:08'),
		difficulties: 3,
	},
	{
		score: 44,
		songID: 16,
		userID: 18,
		playDate: new Date('2023-09-22 10:39:34'),
		difficulties: 1,
	},
	{
		score: 59,
		songID: 863,
		userID: 18,
		playDate: new Date('2023-09-17 4:12:43'),
		difficulties: 1,
	},
	{
		score: 18,
		songID: 276,
		userID: 18,
		playDate: new Date('2023-09-08 15:47:54'),
		difficulties: 2,
	},
	{
		score: 64,
		songID: 557,
		userID: 18,
		playDate: new Date('2023-10-17 0:13:46'),
		difficulties: 1,
	},
	{
		score: 2,
		songID: 452,
		userID: 18,
		playDate: new Date('2023-09-26 5:13:31'),
		difficulties: 5,
	},
	{
		score: 99,
		songID: 546,
		userID: 18,
		playDate: new Date('2023-09-11 16:31:37'),
		difficulties: 1,
	},
	{
		score: 75,
		songID: 598,
		userID: 18,
		playDate: new Date('2023-10-12 22:56:24'),
		difficulties: 4,
	},
	{
		score: 4,
		songID: 258,
		userID: 18,
		playDate: new Date('2023-09-20 8:26:50'),
		difficulties: 2,
	},
	{
		score: 50,
		songID: 190,
		userID: 18,
		playDate: new Date('2023-09-20 20:07:06'),
		difficulties: 4,
	},
	{
		score: 9,
		songID: 914,
		userID: 18,
		playDate: new Date('2023-10-30 16:57:14'),
		difficulties: 5,
	},
	{
		score: 7,
		songID: 92,
		userID: 18,
		playDate: new Date('2023-09-18 20:33:44'),
		difficulties: 5,
	},
	{
		score: 94,
		songID: 98,
		userID: 18,
		playDate: new Date('2023-10-15 5:05:18'),
		difficulties: 5,
	},
	{
		score: 94,
		songID: 424,
		userID: 18,
		playDate: new Date('2023-09-22 9:59:12'),
		difficulties: 5,
	},
	{
		score: 14,
		songID: 635,
		userID: 18,
		playDate: new Date('2023-09-02 6:58:39'),
		difficulties: 4,
	},
	{
		score: 99,
		songID: 893,
		userID: 18,
		playDate: new Date('2023-10-05 16:09:33'),
		difficulties: 1,
	},
	{
		score: 94,
		songID: 67,
		userID: 18,
		playDate: new Date('2023-09-01 8:11:37'),
		difficulties: 2,
	},
	{
		score: 21,
		songID: 335,
		userID: 18,
		playDate: new Date('2023-10-03 2:07:44'),
		difficulties: 3,
	},
	{
		score: 47,
		songID: 294,
		userID: 18,
		playDate: new Date('2023-09-13 17:32:46'),
		difficulties: 4,
	},
	{
		score: 89,
		songID: 184,
		userID: 18,
		playDate: new Date('2023-09-04 5:20:13'),
		difficulties: 2,
	},
	{
		score: 28,
		songID: 345,
		userID: 18,
		playDate: new Date('2023-09-07 6:35:11'),
		difficulties: 3,
	},
	{
		score: 93,
		songID: 697,
		userID: 18,
		playDate: new Date('2023-09-29 0:07:10'),
		difficulties: 2,
	},
	{
		score: 58,
		songID: 666,
		userID: 18,
		playDate: new Date('2023-09-09 3:03:02'),
		difficulties: 2,
	},
	{
		score: 73,
		songID: 459,
		userID: 18,
		playDate: new Date('2023-10-05 7:33:54'),
		difficulties: 4,
	},
	{
		score: 50,
		songID: 695,
		userID: 18,
		playDate: new Date('2023-09-26 18:26:55'),
		difficulties: 4,
	},
	{
		score: 39,
		songID: 995,
		userID: 18,
		playDate: new Date('2023-10-24 17:34:09'),
		difficulties: 3,
	},
	{
		score: 25,
		songID: 122,
		userID: 18,
		playDate: new Date('2023-10-25 18:54:12'),
		difficulties: 1,
	},
	{
		score: 29,
		songID: 439,
		userID: 18,
		playDate: new Date('2023-09-15 0:44:48'),
		difficulties: 3,
	},
	{
		score: 79,
		songID: 234,
		userID: 18,
		playDate: new Date('2023-09-13 13:53:16'),
		difficulties: 2,
	},
	{
		score: 0,
		songID: 369,
		userID: 18,
		playDate: new Date('2023-10-30 22:54:34'),
		difficulties: 1,
	},
	{
		score: 25,
		songID: 223,
		userID: 18,
		playDate: new Date('2023-09-13 1:09:11'),
		difficulties: 3,
	},
	{
		score: 55,
		songID: 716,
		userID: 18,
		playDate: new Date('2023-09-12 19:43:23'),
		difficulties: 3,
	},
	{
		score: 100,
		songID: 62,
		userID: 18,
		playDate: new Date('2023-09-11 15:33:40'),
		difficulties: 5,
	},
	{
		score: 74,
		songID: 271,
		userID: 18,
		playDate: new Date('2023-10-25 23:14:51'),
		difficulties: 3,
	},
	{
		score: 22,
		songID: 265,
		userID: 18,
		playDate: new Date('2023-09-17 15:01:38'),
		difficulties: 1,
	},
	{
		score: 79,
		songID: 552,
		userID: 18,
		playDate: new Date('2023-09-28 20:13:14'),
		difficulties: 5,
	},
	{
		score: 50,
		songID: 603,
		userID: 18,
		playDate: new Date('2023-09-06 3:52:21'),
		difficulties: 5,
	},
];

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

	const dailyScore = calculateDailyAverages(fakeData);
	// const dailyScore = calculateDailyAverages(scoresQuery.data.history);
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
						bgColor={'rgba(16,16,20,0.5)'}
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
						bgColor={'rgba(16,16,20,0.5)'}
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
