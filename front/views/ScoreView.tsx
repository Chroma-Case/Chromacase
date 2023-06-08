import {
	Card,
	Column,
	Image,
	Row,
	Text,
	ScrollView,
	VStack,
} from "native-base";
import Translate from "../components/Translate";
import SongCardGrid from "../components/SongCardGrid";
import { RouteProps, useNavigation } from "../Navigation";
import { CardBorderRadius } from "../components/Card";
import TextButton from "../components/TextButton";
import API from "../API";
import LoadingComponent from "../components/Loading";
import CardGridCustom from "../components/CardGridCustom";
import SongCard from "../components/SongCard";
import { useQueries, useQuery } from "react-query";
import { LoadingView } from "../components/Loading";

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

const ScoreView = ({
	songId,
	overallScore,
	precision,
	score,
}: RouteProps<ScoreViewProps>) => {
	const navigation = useNavigation();
	const songQuery = useQuery(["song", songId], () => API.getSong(songId));
	const artistQuery = useQuery(
		["song", songId, "artist"],
		() => API.getArtist(songQuery.data!.artistId!),
		{ enabled: songQuery.data != undefined }
	);
	// const perfoamnceRecommandationsQuery = useQuery(['song', props.songId, 'score', 'latest', 'recommendations'], () => API.getLastSongPerformanceScore(props.songId));
	const recommendations = useQuery(["song", "recommendations"], () =>
		API.getSongSuggestions()
	);
	const artistRecommendations = useQueries(
		recommendations.data
			?.filter(({ artistId }) => artistId !== null)
			.map((song) => ({
				queryKey: ["artist", song.artistId],
				queryFn: () => API.getArtist(song.artistId!),
			})) ?? []
	);

	if (
		!recommendations.data ||
		artistRecommendations.find(({ data }) => !data) ||
		!songQuery.data ||
		(songQuery.data.artistId && !artistQuery.data)
	) {
		return <LoadingView />;
	}

	return (
		<ScrollView p={8} contentContainerStyle={{ alignItems: "center" }}>
			<VStack width={{ base: "100%", lg: "50%" }} textAlign="center">
				<Text bold fontSize="lg">
					{songQuery.data.name}
				</Text>
				<Text bold>{artistQuery.data?.name}</Text>
				<Row style={{ justifyContent: "center", display: "flex" }}>
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
						<Column style={{ justifyContent: "space-evenly", flexGrow: 1 }}>
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
							<Row style={{ alignItems: "center" }}>
								<Translate translationKey="score" format={(t) => t + " : "} />
								<Text bold fontSize="xl">
									{overallScore + "pts"}
								</Text>
							</Row>
							<Row style={{ alignItems: "center" }}>
								<Translate translationKey="perfect" format={(t) => t + " : "} />
								<Text bold fontSize="xl">
									{score.perfect}
								</Text>
							</Row>
							<Row style={{ alignItems: "center" }}>
								<Translate translationKey="great" format={(t) => t + " : "} />
								<Text bold fontSize="xl">
									{score.great}
								</Text>
							</Row>
							<Row style={{ alignItems: "center" }}>
								<Translate translationKey="good" format={(t) => t + " : "} />
								<Text bold fontSize="xl">
									{score.good}
								</Text>
							</Row>
							<Row style={{ alignItems: "center" }}>
								<Translate translationKey="wrong" format={(t) => t + " : "} />
								<Text bold fontSize="xl">
									{score.wrong}
								</Text>
							</Row>

							<Row style={{ alignItems: "center" }}>
								<Translate translationKey="missed" format={(t) => t + " : "} />
								<Text bold fontSize="xl">
									{score.missed}
								</Text>
							</Row>
							<Row style={{ alignItems: "center" }}>
								<Translate translationKey="bestStreak" format={(t) => t + " : "} />
								<Text bold fontSize="xl">
									{score.max_streak}
								</Text>
							</Row>
							<Row style={{ alignItems: "center" }}>
								<Translate translationKey="precision" format={(t) => t + " : "} />
								<Text bold fontSize="xl">
									{precision + "%"}
								</Text>
							</Row>

						</Column>
					</Card>
				</Row>
				<CardGridCustom
					style={{ justifyContent: "space-evenly" }}
					content={recommendations.data.map((i) => ({
						cover: i.cover,
						name: i.name,
						artistName:
							artistRecommendations.find(({ data }) => data?.id == i.artistId)
								?.data?.name ?? "",
						songId: i.id,
					}))}
					cardComponent={SongCard}
					heading={
						<Text fontSize="sm">
							<Translate translationKey="songsToGetBetter" />
						</Text>
					}
				/>
				<Row space={3} style={{ width: "100%", justifyContent: "center" }}>
					<TextButton
						colorScheme="gray"
						translate={{ translationKey: "backBtn" }}
						onPress={() => navigation.navigate("Home")}
					/>
					<TextButton
						onPress={() => navigation.navigate("Song", { songId })}
						translate={{ translationKey: "playAgain" }}
					/>
				</Row>
			</VStack>
		</ScrollView>
	);
};

export default ScoreView;
