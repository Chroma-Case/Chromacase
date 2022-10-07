import { useRoute } from "@react-navigation/native";
import { Button, Divider, Box, Center, Image, Text, VStack, HStack, PresenceTransition, Icon } from "native-base";
import API from "../API";
import { useQuery } from 'react-query';
import LoadingComponent from "../components/loading";
import React, { useEffect, useState } from "react";
import logo from '../assets/cover.png';
import { translate } from "../i18n/i18n";
import formatDuration from "format-duration";
import { Ionicons, FontAwesome } from '@expo/vector-icons';

interface SongLobbyProps {
	// The unique identifier to find a song
	songId: number;
}

const SongLobbyView = () => {
	const route = useRoute();
	const props: SongLobbyProps = route.params as any;
	const songQuery = useQuery(['song', props.songId], () => API.getSong(props.songId));
	const chaptersQuery = useQuery(['song', props.songId, 'chapters'], () => API.getSongChapters(props.songId));
	const scoresQuery = useQuery(['song', props.songId, 'scores'], () => API.getSongHistory(props.songId));
	const [chaptersOpen, setChaptersOpen] = useState(false);
	useEffect(() => {
		if (chaptersOpen && !chaptersQuery.data)
			chaptersQuery.refetch();
	}, [chaptersOpen]);
	useEffect(() => {}, [songQuery.isLoading]);
	if (songQuery.isLoading || scoresQuery.isLoading)
		return <Center style={{ flexGrow: 1 }}>
			<LoadingComponent/>
		</Center>
	return (
		<Box style={{ padding: 30, flexDirection: 'column' }}>
			<Box style={{ flexDirection: 'row', height: '30%'}}>
				<Box style={{ flex: 3 }}>
					<Image source={logo} style={{ height: '100%', width: undefined, resizeMode: 'contain' }}/>
				</Box>
				<Box style={{ flex: 0.5 }}/>
				<Box style={{ flex: 3, padding: 10, flexDirection: 'column', justifyContent: 'space-between' }}>
					<Box flex={1}>
						<Text bold fontSize='lg'>{songQuery.data!.title}</Text>
						<Text>{'3:20'} - {translate('level')} { chaptersQuery.data!.reduce((a, b) => a + b.difficulty, 0) / chaptersQuery.data!.length }</Text>
						<Button width='fit-content'  rightIcon={<Icon as={Ionicons} name="play-outline"/>}>{ translate('playBtn') }</Button>
					</Box>
				</Box>
			</Box>
			<Box style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 30}}>
				<Box style={{ flexDirection: 'column', alignItems: 'center' }}>
					<Text bold fontSize='lg'>{translate('bestScore') }</Text>
					<Text>{scoresQuery.data!.sort()[0]?.score}</Text>
				</Box>
				<Box style={{ flexDirection: 'column', alignItems: 'center' }}>
					<Text bold fontSize='lg'>{translate('lastScore') }</Text>
					<Text>{scoresQuery.data!.slice(-1)[0]!.score}</Text>
				</Box>
			</Box>
			<Text style={{ paddingBottom: 10 }}>{songQuery.data!.description}</Text>
			<Box flexDirection='row'>
				<Button
					variant='ghost'
					onPress={() => setChaptersOpen(!chaptersOpen)}
					endIcon={<Icon as={Ionicons} name={chaptersOpen ? "chevron-up-outline" : "chevron-down-outline"}/>}
				>
					{translate('chapters')}
				</Button>
			</Box>
			<PresenceTransition visible={chaptersOpen} initial={{ opacity: 0 }}>
				{ chaptersQuery.isLoading && <LoadingComponent/>}
				{ !chaptersQuery.isLoading && 
					<VStack flex={1} space={4} padding="4" divider={<Divider />}>
					{ chaptersQuery.data!.map((chapter) =>
						<Box flexGrow={1} flexDirection='row' justifyContent="space-between">
							<Text>{chapter.name}</Text>
							<Text>
								{`${translate('level')} ${chapter.difficulty} - ${formatDuration((chapter.end - chapter.start) * 1000)}`}
							</Text>
						</Box>
					)}
					</VStack>
				}
			</PresenceTransition>
		</Box>
	)
}

export default SongLobbyView;