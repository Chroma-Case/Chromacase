import {
	Box,
	Column,
	Row,
	Select,
	useBreakpointValue,
	useTheme,
	Text,
	ScrollView,
	View,
} from 'native-base';
import { LineChart } from 'react-native-chart-kit';
import SongHistory from '../models/SongHistory';
import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import CheckboxBase from './UI/CheckboxBase';
import { Dataset } from 'react-native-chart-kit/dist/HelperTypes';

type ScoreGraphProps = {
	// The result of the call to API.getSongHistory
	songHistory: SongHistory;
};

const formatScoreDate = (playDate: Date): string => {
	// const formattedDate = `${pad(playDate.getDay())}/${pad(playDate.getMonth())}`;
	// const formattedTime = `${pad(playDate.getHours())}:${pad(playDate.getMinutes())}`;
	return `${playDate.getDate()}/${playDate.getMonth()}`;
};

const ScoreGraph = (props: ScoreGraphProps) => {
	const layout = useWindowDimensions();
	const [selectedRange, setSelectedRange] = useState('3days');
	const [displayScore, setDisplayScore] = useState(true);
	const [displayPedals, setDisplayPedals] = useState(false);
	const [displayRightHand, setDisplayRightHand] = useState(false);
	const [displayLeftHand, setDisplayLeftHand] = useState(false);
	const [displayAccuracy, setDisplayAccuracy] = useState(false);
	const [displayArpeges, setDisplayArpeges] = useState(false);
	const [displayChords, setDisplayChords] = useState(false);

	const rangeOptions = [
		{ label: '3 derniers jours', value: '3days' },
		{ label: 'Dernière semaine', value: 'week' },
		{ label: 'Dernier mois', value: 'month' },
	];
	const scores = props.songHistory.history.sort((a, b) => {
		if (a.playDate < b.playDate) {
			return -1;
		} else if (a.playDate > b.playDate) {
			return 1;
		}
		return 0;
	});

	const filterData = () => {
		const oneWeekAgo = new Date();
		const oneMonthAgo = new Date();
		const threeDaysAgo = new Date();
		switch (selectedRange) {
			case 'week':
				oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
				return scores.filter((item) => item.playDate >= oneWeekAgo);
			case 'month':
				oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
				return scores.filter((item) => item.playDate > oneMonthAgo);
			default:
				threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
				return scores.filter((item) => item.playDate >= threeDaysAgo);
		}
	};

	const theme = useTheme();
	const [containerWidth, setContainerWidth] = useState(0);
	// We sort the scores by date, asc.
	// By default, the API returns them in desc.
	// const pointsToDisplay = props.width / 100;
	const isSmall = useBreakpointValue({ base: true, md: false });

	const tempDatasets: Dataset[] = [];

	const skills = [
		{
			title: 'Score',
			value: 'score',
			data: filterData().map(({ score }) => score),
			color: '#5f74f7',
			check: displayScore,
			setCheck: setDisplayScore,
		},
		{
			title: 'Pedals',
			value: 'pedals',
			color: '#ae84fb',
			data: filterData().map(({ score }) => (score > 100 ? score - 100 : score * 1.4)),
			check: displayPedals,
			setCheck: setDisplayPedals,
		},
		{
			title: 'Right hand',
			value: 'rightHand',
			data: filterData().map(({ score }) => (score > 10 ? score - 10 : score * 0.2)),
			color: '#a61455',
			check: displayRightHand,
			setCheck: setDisplayRightHand,
		},
		{
			title: 'Left hand',
			value: 'leftHand',
			data: filterData().map(({ score }) => (score > 50 ? score - 50 : score * 0.8)),
			color: '#ed4a51',
			check: displayLeftHand,
			setCheck: setDisplayLeftHand,
		},
		{
			title: 'Accuracy',
			value: 'accuracy',
			data: filterData().map(({ score }) => (score > 40 ? score - 40 : score * 0.4)),
			color: '#ff7a72',
			check: displayAccuracy,
			setCheck: setDisplayAccuracy,
		},
		{
			title: 'Arpeges',
			value: 'arpeges',
			data: filterData().map(({ score }) => (score > 200 ? score - 200 : score * 1.2)),
			color: '#ead93c',
			check: displayArpeges,
			setCheck: setDisplayArpeges,
		},
		{
			title: 'Chords',
			value: 'chords',
			data: filterData().map(({ score }) => (score > 50 ? score - 50 : score)),
			color: '#73d697',
			check: displayChords,
			setCheck: setDisplayChords,
		},
	];

	for (const skill of skills) {
		if (skill.check) {
			tempDatasets.push({
				data: skill.data,
				color: () => skill.color,
			});
		}
	}

	return (
		<Column>
			<Row
				style={{
					alignItems: 'center',
				}}
			>
				<Text>Skils</Text>
				<ScrollView horizontal={true}>
					{skills.map((skill) => (
						<View key={skill.value} style={{ paddingLeft: 20 }}>
							<CheckboxBase
								title={skill.title}
								value={skill.value}
								check={skill.check}
								setCheck={skill.setCheck}
							/>
						</View>
					))}
				</ScrollView>
				<Select
					selectedValue={selectedRange}
					onValueChange={(itemValue) => setSelectedRange(itemValue)}
					defaultValue={'3days'}
					bgColor={'rgba(16,16,20,0.5)'}
					variant="filled"
					style={{ display: 'flex', justifyContent: 'center' }}
					width={layout.width > 650 ? '200' : '100'}
				>
					{rangeOptions.map((option) => (
						<Select.Item key={option.label} label={option.label} value={option.value} />
					))}
				</Select>
			</Row>
			<Box
				style={{ width: '100%', marginTop: 20 }}
				onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
			>
				{tempDatasets.length > 0 && (
					<LineChart
						data={{
							labels: isSmall
								? []
								: filterData().map(({ playDate }) => formatScoreDate(playDate)),
							datasets: tempDatasets,
						}}
						width={containerWidth}
						height={300} // Completely arbitrary
						transparent={true}
						yAxisSuffix=" pts"
						chartConfig={{
							propsForLabels: {
								fontFamily: 'Lexend',
							},
							propsForVerticalLabels: {
								rotation: -90,
							},
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
				)}
			</Box>
		</Column>
	);
};

export default ScoreGraph;
