import {
	Divider,
	Box,
	Center,
	Image,
	Text,
	VStack,
	PresenceTransition,
	Icon,
	Stack,
} from "native-base";
import { useQuery } from "react-query";
import LoadingComponent, { LoadingView } from "../components/Loading";
import React, { useEffect, useState } from "react";
import { Translate, translate } from "../i18n/i18n";
import formatDuration from "format-duration";
import { Ionicons } from "@expo/vector-icons";
import API from "../API";
import TextButton from "../components/TextButton";
import { RouteProps, useNavigation } from "../Navigation";

interface SongLobbyProps {
	// The unique identifier to find a song
	songId: number;
}

const SongLobbyView = (props: RouteProps<SongLobbyProps>) => {
	const navigation = useNavigation();
	const songQuery = useQuery(["song", props.songId], () =>
		API.getSong(props.songId)
	);
	const chaptersQuery = useQuery(["song", props.songId, "chapters"], () =>
		API.getSongChapters(props.songId)
	);
	const scoresQuery = useQuery(["song", props.songId, "scores"], () =>
		API.getSongHistory(props.songId)
	);
	const [chaptersOpen, setChaptersOpen] = useState(false);
	useEffect(() => {
		if (chaptersOpen && !chaptersQuery.data) chaptersQuery.refetch();
	}, [chaptersOpen]);
	useEffect(() => { }, [songQuery.isLoading]);
	if (songQuery.isLoading || scoresQuery.isLoading) return <LoadingView />;
	return (
		<Box style={{ padding: 30, flexDirection: "column" }}>
			<Box style={{ flexDirection: "row", height: "30%" }}>
				<Box style={{ flex: 3 }}>
					<Image
						source={{ uri: songQuery.data!.cover }}
						alt={songQuery.data?.name}
						style={{
							height: "100%",
							width: undefined,
							resizeMode: "contain",
							aspectRatio: 1,
						}}
					/>
				</Box>
				<Box style={{ flex: 0.5 }} />
				<Box
					style={{
						flex: 3,
						padding: 10,
						flexDirection: "column",
						justifyContent: "space-between",
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
									`${level}: ${chaptersQuery.data!.reduce((a, b) => a + b.difficulty, 0) /
									chaptersQuery.data!.length
									}`
								}
							/>
						</Text>
						<TextButton
							translate={{ translationKey: "playBtn" }}
							width="auto"
							onPress={() =>
								navigation.navigate("Play", {
									songId: songQuery.data!.id,
									type: "normal",
								})
							}
							rightIcon={<Icon as={Ionicons} name="play-outline" />}
						/>
						<TextButton
							translate={{ translationKey: "practiceBtn" }}
							width="auto"
							onPress={() =>
								navigation.navigate("Play", {
									songId: songQuery.data!.id,
									type: "practice",
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
					flexDirection: "row",
					justifyContent: "space-between",
					padding: 30,
				}}
			>
				<Box style={{ flexDirection: "column", alignItems: "center" }}>
					<Text bold fontSize="lg">
						<Translate translationKey="bestScore" />
					</Text>
					<Text>{scoresQuery.data?.best ?? 0}</Text>
				</Box>
				<Box style={{ flexDirection: "column", alignItems: "center" }}>
					<Text bold fontSize="lg">
						<Translate translationKey="lastScore" />
					</Text>
					<Text>{scoresQuery.data?.history.at(0)?.score ?? 0}</Text>
				</Box>
			</Box>
			{/* <Text style={{ paddingBottom: 10 }}>{songQuery.data!.description}</Text> */}
			<Box flexDirection="row">
				<TextButton
					translate={{ translationKey: "chapters" }}
					variant="ghost"
					onPress={() => setChaptersOpen(!chaptersOpen)}
					endIcon={
						<Icon
							as={Ionicons}
							name={
								chaptersOpen ? "chevron-up-outline" : "chevron-down-outline"
							}
						/>
					}
				/>
			</Box>
			<PresenceTransition visible={chaptersOpen} initial={{ opacity: 0 }}>
				{chaptersQuery.isLoading && <LoadingComponent />}
				{!chaptersQuery.isLoading && (
					<VStack flex={1} space={4} padding="4" divider={<Divider />}>
						{chaptersQuery.data!.map((chapter) => (
							<Box
								key={chapter.id}
								flexGrow={1}
								flexDirection="row"
								justifyContent="space-between"
							>
								<Text>{chapter.name}</Text>
								<Text>
									{`${translate("level")} ${chapter.difficulty
										} - ${formatDuration((chapter.end - chapter.start) * 1000)}`}
								</Text>
							</Box>
						))}
					</VStack>
				)}
			</PresenceTransition>
		</Box>
	);
};

export default SongLobbyView;
