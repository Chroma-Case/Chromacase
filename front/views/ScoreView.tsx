import { Card, Column, Image, Row, Text, useTheme, ScrollView, Center, VStack } from "native-base"
import Translate from "../components/Translate";
import SongCardGrid from "../components/SongCardGrid";
import { RouteProps, useNavigation } from "../Navigation";
import { CardBorderRadius } from "../components/Card";
import TextButton from "../components/TextButton";
import API from '../API';
import { useQuery } from "react-query";
import LoadingComponent from "../components/Loading";

type ScoreViewProps = { songId: number }

const ScoreView = ({ songId }: RouteProps<ScoreViewProps>) => {
	const theme = useTheme();
	const navigation = useNavigation();
	// const songQuery = useQuery(['song', props.songId], () => API.getSong(props.songId));
	// const songScoreQuery = useQuery(['song', props.songId, 'score', 'latest'], () => API.getLastSongPerformanceScore(props.songId));
	// const perfoamnceRecommandationsQuery = useQuery(['song', props.songId, 'score', 'latest', 'recommendations'], () => API.getLastSongPerformanceScore(props.songId));
	const recommendations = useQuery(['song', 'recommendations'], () => API.getSongSuggestions());

	if (!recommendations.data) {
		return <Center style={{ flexGrow: 1 }}>
			<LoadingComponent/>
		</Center>;
	}
	return <ScrollView p={8} contentContainerStyle={{ alignItems: 'center' }}>
		<VStack width={{ base: '100%', lg: '50%' }} textAlign='center'>
			<Text bold fontSize='lg'>Rolling in the Deep</Text>
			<Text bold>Adele - 3:45</Text>
			<Row style={{ justifyContent: 'center', display: 'flex' }}>
				<Card shadow={3} style={{ flex: 1 }}>
					<Image
						style={{ zIndex: 0, aspectRatio: 1, margin: 5, borderRadius: CardBorderRadius}}
						source={{ uri: 'https://imgs.search.brave.com/AinqAz0knOSOt0V3rcv7ps7aMVCo0QQfZ-1NTdwVjK0/rs:fit:1200:1200:1/g:ce/aHR0cDovLzEuYnAu/YmxvZ3Nwb3QuY29t/Ly0xTmZtZTdKbDVk/US9UaHd0Y3pieEVa/SS9BQUFBQUFBQUFP/TS9QdGx6ZWtWd2Zt/ay9zMTYwMC9BZGVs/ZSstKzIxKyUyNTI4/T2ZmaWNpYWwrQWxi/dW0rQ292ZXIlMjUy/OS5qcGc' }}
					/>
				</Card>
				<Card shadow={3} style={{ flex: 1 }}>
					<Column style={{ justifyContent: 'space-evenly', flexGrow: 1 }}>
						<Row style={{ alignItems: 'center' }}>
							<Text bold fontSize='xl'>
								80
							</Text>
							<Translate translationKey='goodNotes' format={(t) => ' ' + t}/>
						</Row>
						<Row style={{ alignItems: 'center' }}>
							<Text bold fontSize='xl'>
								80
							</Text>
							<Translate translationKey='goodNotesInARow' format={(t) => ' ' + t}/>
						</Row>
						<Row style={{ alignItems: 'center' }}>
							<Translate translationKey='precisionScore' format={(t) => t + ' : '}/>
							<Text bold fontSize='xl'>
								{"80" + "%"}
							</Text>
						</Row>
					</Column>
					{/* Precision */}
				</Card>
			</Row>
			<SongCardGrid
				style={{ justifyContent: "space-evenly" }}
				heading={<Text fontSize='sm'>
					<Translate translationKey="songsToGetBetter"/>
				</Text>}
				songs={recommendations.data.map((i) => ({
					albumCover: i?.cover,
					songTitle: i?.name ,
					artistName: "Artist",
					songId: i?.id
				}))}
			/>
			<Row space={3} style={{ width: '100%', justifyContent: 'center' }}>
				<TextButton colorScheme='gray'
					translate={{ translationKey: 'backBtn' }}
					onPress={() => navigation.navigate('Home')}
				/>
				<TextButton
					onPress={() => navigation.navigate('Song', { songId: 1 })}
					translate={{ translationKey: 'playAgain' }}
				/>
			</Row>
		</VStack>
	</ScrollView>
}

export default ScoreView;
