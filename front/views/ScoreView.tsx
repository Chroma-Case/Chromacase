import { Card, Column, Image, Row, Text, ScrollView, VStack } from 'native-base';
import Translate from '../components/Translate';
import { RouteProps, useNavigation } from '../Navigation';
import { CardBorderRadius } from '../components/Card';
import TextButton from '../components/TextButton';
import API from '../API';
import CardGridCustom from '../components/CardGridCustom';
import SongCard from '../components/SongCard';
import { useQuery } from '../Queries';
import { LoadingView } from '../components/Loading';
import ScoreGraph from '../components/ScoreGraph';

type ScoreViewProps = {
	songId: number;
	overallScore: number;
	precision: number;
	score: {
		missed: number;
		good: number;
		great: number;
		perfect: number;
		wrong: number;
		max_score: number;
		current_streak: number;
		max_streak: number;
	};
};

const ScoreView = (props: RouteProps<ScoreViewProps>) => {
	const { songId, overallScore, precision, score } = props;
	const navigation = useNavigation();
	const songQuery = useQuery(API.getSong(songId, ['artist']));
	const recommendations = useQuery(API.getSongSuggestions(['artist']));

	if (!recommendations.data || !songQuery.data) {
		return <LoadingView />;
	}
	if (songQuery.isError) {
		navigation.navigate('Error');
		return <></>;
	}

	return (
		<ScrollView p={8} contentContainerStyle={{ alignItems: 'center' }}>
			<VStack width={{ base: '100%', lg: '50%' }} space={3} textAlign="center">
				<Text bold fontSize="lg">
					{songQuery.data.name}
				</Text>
				<Text bold>{songQuery.data.artist!.name}</Text>
				<Row style={{ justifyContent: 'center', display: 'flex' }}>
					<Card shadow={3} style={{ flex: 1 }}>
						<Image
							style={{
								zIndex: 0,
								aspectRatio: 1,
								margin: 5,
								borderRadius: CardBorderRadius,
							}}
							source={{ uri: songQuery.data.cover }}
						/>
					</Card>
					<Card shadow={3} style={{ flex: 1 }}>
						<Column style={{ justifyContent: 'space-evenly', flexGrow: 1 }}>
							{/*<Row style={{ alignItems: 'center' }}>
							<Text bold fontSize='xl'>

							</Text>
							<Translate translationKey='goodNotes' format={(t) => ' ' + t}/>
						</Row>
						<Row style={{ alignItems: 'center' }}>
							<Text bold fontSize='xl'>
								80
							</Text>
							<Translate translationKey='goodNotesInARow' format={(t) => ' ' + t}/>
						</Row>*/}
							<Row style={{ alignItems: 'center' }}>
								<Translate translationKey="score" format={(t) => t + ' : '} />
								<Text bold fontSize="xl">
									{overallScore + 'pts'}
								</Text>
							</Row>
							<Row style={{ alignItems: 'center' }}>
								<Translate translationKey="perfect" format={(t) => t + ' : '} />
								<Text bold fontSize="xl">
									{score.perfect}
								</Text>
							</Row>
							<Row style={{ alignItems: 'center' }}>
								<Translate translationKey="great" format={(t) => t + ' : '} />
								<Text bold fontSize="xl">
									{score.great}
								</Text>
							</Row>
							<Row style={{ alignItems: 'center' }}>
								<Translate translationKey="good" format={(t) => t + ' : '} />
								<Text bold fontSize="xl">
									{score.good}
								</Text>
							</Row>
							<Row style={{ alignItems: 'center' }}>
								<Translate translationKey="wrong" format={(t) => t + ' : '} />
								<Text bold fontSize="xl">
									{score.wrong}
								</Text>
							</Row>

							<Row style={{ alignItems: 'center' }}>
								<Translate translationKey="missed" format={(t) => t + ' : '} />
								<Text bold fontSize="xl">
									{score.missed}
								</Text>
							</Row>
							<Row style={{ alignItems: 'center' }}>
								<Translate translationKey="bestStreak" format={(t) => t + ' : '} />
								<Text bold fontSize="xl">
									{score.max_streak}
								</Text>
							</Row>
							<Row style={{ alignItems: 'center' }}>
								<Translate translationKey="precision" format={(t) => t + ' : '} />
								<Text bold fontSize="xl">
									{precision + '%'}
								</Text>
							</Row>
						</Column>
					</Card>
				</Row>
				<ScoreGraph />
				<CardGridCustom
					style={{ justifyContent: 'space-evenly' }}
					content={recommendations.data.map((i) => ({
						cover: i.cover,
						name: i.name,
						artistName: i.artist!.name,
						songId: i.id,
					}))}
					cardComponent={SongCard}
					heading={
						<Text fontSize="sm">
							<Translate translationKey="songsToGetBetter" />
						</Text>
					}
				/>
				<Row space={3} style={{ width: '100%', justifyContent: 'center' }}>
					<TextButton
						colorScheme="gray"
						translate={{ translationKey: 'backBtn' }}
						onPress={() => navigation.navigate('Home', {})}
					/>
					<TextButton
						onPress={() => navigation.navigate('Play', { songId })}
						translate={{ translationKey: 'playAgain' }}
					/>
				</Row>
			</VStack>
		</ScrollView>
	);
};

export default ScoreView;
