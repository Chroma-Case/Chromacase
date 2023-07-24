import { Box, Image, Text, Icon, Stack, useTheme } from 'native-base';
import { useQuery } from '../Queries';
import { LoadingView } from '../components/Loading';
import React, { useMemo } from 'react';
import { Translate } from '../i18n/i18n';
import { Ionicons } from '@expo/vector-icons';
import API from '../API';
import TextButton from '../components/TextButton';
import { RouteProps, useNavigation } from '../Navigation';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { CardBorderRadius } from '../components/Card';

interface SongLobbyProps {
	// The unique identifier to find a song
	songId: number;
}

const formatScoreDate = (playDate: Date): string => {
	const pad = (n: number) => n.toString().padStart(2, '0');
	const formattedDate = `${pad(playDate.getDay())}/${pad(
		playDate.getMonth()
	)}/${playDate.getFullYear()}`;
	const formattedTime = `${pad(playDate.getHours())}:${pad(playDate.getMinutes())}`;
	return `${formattedDate} ${formattedTime}`;
};

const SongLobbyView = (props: RouteProps<SongLobbyProps>) => {
	const theme = useTheme();
	const rootComponentPadding = 30;
	const navigation = useNavigation();
	// Refetch to update score when coming back from score view
	const songQuery = useQuery(API.getSong(props.songId), { refetchOnWindowFocus: true });
	const chaptersQuery = useQuery(API.getSongChapters(props.songId), {
		refetchOnWindowFocus: true,
	});
	const scoresQuery = useQuery(API.getSongHistory(props.songId), { refetchOnWindowFocus: true });
	const scores = useMemo(
		() => Array.from(scoresQuery.data?.history ?? []).reverse(),
		[scoresQuery.data]
	);
	if (songQuery.isLoading || scoresQuery.isLoading) return <LoadingView />;
	if (songQuery.isError || scoresQuery.isError) {
		navigation.navigate('Error');
		return <></>;
	}
	return (
		<Box style={{ padding: rootComponentPadding, flexDirection: 'column' }}>
			<Box style={{ flexDirection: 'row', height: '30%' }}>
				<Box style={{ flex: 3 }}>
					<Image
						source={{ uri: songQuery.data!.cover }}
						alt={songQuery.data?.name}
						style={{
							height: '100%',
							width: undefined,
							resizeMode: 'contain',
							aspectRatio: 1,
						}}
					/>
				</Box>
				<Box style={{ flex: 0.5 }} />
				<Box
					style={{
						flex: 3,
						padding: 10,
						flexDirection: 'column',
						justifyContent: 'space-between',
					}}
				>
					<Stack flex={1} space={3}>
						<Text bold isTruncated numberOfLines={2} fontSize="lg">
							{songQuery.data!.name}
						</Text>
						<Text>
							<Translate
								translationKey="level"
								format={(level) =>
									`${level}: ${
										chaptersQuery.data!.reduce((a, b) => a + b.difficulty, 0) /
										chaptersQuery.data!.length
									}`
								}
							/>
						</Text>
						<TextButton
							translate={{ translationKey: 'playBtn' }}
							width="auto"
							onPress={() =>
								navigation.navigate('Play', {
									songId: songQuery.data!.id,
									type: 'normal',
								})
							}
							rightIcon={<Icon as={Ionicons} name="play-outline" />}
						/>
						<TextButton
							translate={{ translationKey: 'practiceBtn' }}
							width="auto"
							onPress={() =>
								navigation.navigate('Play', {
									songId: songQuery.data!.id,
									type: 'practice',
								})
							}
							rightIcon={<Icon as={Ionicons} name="play-outline" />}
							colorScheme="secondary"
						/>
					</Stack>
				</Box>
			</Box>
			<Box
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					padding: 30,
				}}
			>
				<Box style={{ flexDirection: 'column', alignItems: 'center' }}>
					<Text bold fontSize="lg">
						<Translate translationKey="bestScore" />
					</Text>
					<Text>{scoresQuery.data?.best ?? 0}</Text>
				</Box>
				<Box style={{ flexDirection: 'column', alignItems: 'center' }}>
					<Text bold fontSize="lg">
						<Translate translationKey="lastScore" />
					</Text>
					<Text>{scoresQuery.data?.history.at(0)?.score ?? 0}</Text>
				</Box>
			</Box>
			{(scores?.length ?? 0) > 0 && (
				<LineChart
					data={{
						labels: scores?.map(({ playDate }) => formatScoreDate(playDate)) ?? [],
						datasets: [
							{
								data: scores?.map(({ score }) => score) ?? [],
							},
						],
					}}
					width={Dimensions.get('window').width - rootComponentPadding * 2}
					height={200} // Completelty arbitrary
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
						borderRadius: CardBorderRadius,
					}}
				/>
			)}
		</Box>
	);
};

export default SongLobbyView;
