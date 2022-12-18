import { Box, Button, Card, Column, Image, Progress, Row, Text, View, useTheme } from "native-base"
import Translate from "../components/Translate";
import SongCardGrid from "../components/SongCardGrid";
import { useNavigation } from "@react-navigation/native";
import { CardBorderRadius } from "../components/Card";

const ScoreView = (/*{ songId }, { songId: number }*/) => {
	const theme = useTheme();
	const navigation = useNavigation();
	// const songQuery = useQuery(['song', props.songId], () => API.getSong(props.songId));
	// const songScoreQuery = useQuery(['song', props.songId, 'score', 'latest'], () => API.getLastSongPerformanceScore(props.songId));
	// const perfoamnceRecommandationsQuery = useQuery(['song', props.songId, 'score', 'latest', 'recommendations'], () => API.getLastSongPerformanceScore(props.songId));
	return <Column style={{ flexGrow: 1, justifyContent: 'space-evenly', alignItems: 'center', padding: 10 }}>
		<Text bold fontSize='lg'>Rolling in the Deep</Text>
		<Text bold>Adele - 3:45</Text>
		<Row style={{ flexGrow: 0.5, justifyContent: 'center' }}>
			<Card shadow={3} style={{ aspectRatio: 1 }}>
				<Image
					style={{ zIndex: 0, aspectRatio: 1, margin: 5, borderRadius: CardBorderRadius}}
					source={{ uri: 'https://imgs.search.brave.com/AinqAz0knOSOt0V3rcv7ps7aMVCo0QQfZ-1NTdwVjK0/rs:fit:1200:1200:1/g:ce/aHR0cDovLzEuYnAu/YmxvZ3Nwb3QuY29t/Ly0xTmZtZTdKbDVk/US9UaHd0Y3pieEVa/SS9BQUFBQUFBQUFP/TS9QdGx6ZWtWd2Zt/ay9zMTYwMC9BZGVs/ZSstKzIxKyUyNTI4/T2ZmaWNpYWwrQWxi/dW0rQ292ZXIlMjUy/OS5qcGc' }}
				/>
			</Card>
			<Card shadow={3} style={{ aspectRatio: 1 }}>
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
			heading={<Text fontSize='sm'>
				<Translate translationKey="songsToGetBetter"/>
			</Text>}
			maxItemPerRow={5}
			songs={Array.of(1, 2, 3, 4, 5).map((i) => ({
				albumCover: "",
				songTitle: 'Song ' + i,
				artistName: "Artist",
				songId: i
			}))}
		/>
		<Row space={3} style={{ width: '100%', justifyContent: 'center' }}>
			<Button backgroundColor='gray.300' onPress={() => navigation.navigate('Home')}>
				<Translate translationKey='backBtn'/>
			</Button>
			<Button onPress={() => navigation.navigate('Song', { songId: 1 })}>
				<Translate translationKey='playAgain'/>
			</Button>
		</Row>
	</Column>
}

export default ScoreView;
