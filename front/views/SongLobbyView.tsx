import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Divider, Box, Center, Image, Text, VStack, PresenceTransition, Icon } from "native-base";
import { useQuery } from 'react-query';
import LoadingComponent from "../components/Loading";
import React, { useEffect, useState } from "react";
import { Translate, translate } from "../i18n/i18n";
import formatDuration from "format-duration";
import { Ionicons } from '@expo/vector-icons';
import API from "../API";
import TextButton from "../components/TextButton";

interface SongLobbyProps {
	// The unique identifier to find a song
	songId: number;
}

const SongLobbyView = () => {
	const route = useRoute();
	const navigation = useNavigation();
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
					<Image source={{ uri: songQuery.data!.cover }} style={{ height: '100%', width: undefined, resizeMode: 'contain' }}/>
				</Box>
				<Box style={{ flex: 0.5 }}/>
				<Box style={{ flex: 3, padding: 10, flexDirection: 'column', justifyContent: 'space-between' }}>
					<Box flex={1}>
						<Text bold fontSize='lg'>{songQuery.data!.title}</Text>
						<Text>
							<Translate translationKey='level'
								format={(level) => `${level} - ${ chaptersQuery.data!.reduce((a, b) => a + b.difficulty, 0) / chaptersQuery.data!.length }`}
							/>
						</Text>
						<TextButton translate={{ translationKey: 'playBtn' }} width='auto'
							onPress={() => navigation.navigate('Play', { songId: songQuery.data?.id })}
							rightIcon={<Icon as={Ionicons} name="play-outline"/>}
						/>
					</Box>
				</Box>
			</Box>
			<Box style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 30}}>
				<Box style={{ flexDirection: 'column', alignItems: 'center' }}>
					<Text bold fontSize='lg'>
						<Translate translationKey='bestScore'/>
					</Text>
					<Text>{scoresQuery.data!.sort()[0]?.score}</Text>
				</Box>
				<Box style={{ flexDirection: 'column', alignItems: 'center' }}>
					<Text bold fontSize='lg'>
						<Translate translationKey='lastScore'/>
					</Text>
					<Text>{scoresQuery.data!.slice(-1)[0]!.score}</Text>
				</Box>
			</Box>
			{/* <Text style={{ paddingBottom: 10 }}>{songQuery.data!.description}</Text> */}
			<Box flexDirection='row'>
				<TextButton
					translate={{ translationKey: 'chapters' }}
					variant='ghost'
					onPress={() => setChaptersOpen(!chaptersOpen)}
					endIcon={<Icon as={Ionicons} name={chaptersOpen ? "chevron-up-outline" : "chevron-down-outline"}/>}
				/>
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