import { Box, Image, Text, Icon, Stack } from 'native-base';
import { useQuery } from '../Queries';
import { LoadingView } from '../components/Loading';
import { Translate } from '../i18n/i18n';
import { Ionicons } from '@expo/vector-icons';
import API from '../API';
import TextButton from '../components/TextButton';
import { RouteProps, useNavigation } from '../Navigation';
import ScoreGraph from '../components/ScoreGraph';
import DurationComponent from '../components/DurationComponent';

interface SongLobbyProps {
	// The unique identifier to find a song
	songId: number;
}

const SongLobbyView = (props: RouteProps<SongLobbyProps>) => {
	const rootComponentPadding = 30;
	const navigation = useNavigation();
	// Refetch to update score when coming back from score view
	const songQuery = useQuery(API.getSong(props.songId), { refetchOnWindowFocus: true });
	const chaptersQuery = useQuery(API.getSongChapters(props.songId), {
		refetchOnWindowFocus: true,
	});
	const scoresQuery = useQuery(API.getSongHistory(props.songId), { refetchOnWindowFocus: true });
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
						<DurationComponent length={songQuery.data?.details.length} />
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
			{scoresQuery.data && (scoresQuery.data?.history?.length ?? 0) > 0 && (
				<ScoreGraph songHistory={scoresQuery.data} />
			)}
		</Box>
	);
};

export default SongLobbyView;
