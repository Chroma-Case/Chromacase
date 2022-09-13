import { useRoute } from "@react-navigation/native";
import { Image, View } from "react-native"
import { Button, Divider, IconButton, List, Surface, Text } from "react-native-paper";
import API from "../API";
import { useQuery } from 'react-query';
import LoadingComponent from "../components/loading";
import React, { useEffect, useState } from "react";
import logo from '../assets/cover.png';
import { translate } from "../i18n/i18n";
import formatDuration from "format-duration";

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
		return <View style={{ flexGrow: 1, justifyContent: 'center' }}>
			<LoadingComponent/>
		</View>
	return (
		<View style={{ padding: 30, flexDirection: 'column' }}>
			<View style={{ flexDirection: 'row', height: '30%'}}>
				<View style={{ flex: 3 }}>
					<Image source={logo} style={{ height: '100%', width: undefined, resizeMode: 'contain' }}/>
				</View>
				<View style={{ flex: 0.5 }}/>
				<View style={{ flex: 3, padding: 10, flexDirection: 'column', justifyContent: 'space-between' }}>
					<View>
						<Text style={{ fontWeight: 'bold', fontSize: 25 }}>{songQuery.data!.title}</Text>
						<Text>{'3:20'} - {translate('level')} { chaptersQuery.data!.reduce((a, b) => a + b.difficulty, 0) / chaptersQuery.data!.length }</Text>
					</View>
					<Button icon="play" mode="contained" labelStyle={{ color: 'white' }} contentStyle={{ flexDirection: 'row-reverse' }}>
						{ translate('playBtn') }
					</Button>
				</View>
			</View>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 30}}>
				<View style={{ flexDirection: 'column', alignItems: 'center' }}>
					<Text style={{ fontWeight: 'bold', fontSize: 15 }}>{translate('bestScore') }</Text>
					<Text>{scoresQuery.data!.sort()[0]?.score}</Text>
				</View>
				<View style={{ flexDirection: 'column', alignItems: 'center' }}>
					<Text style={{ fontWeight: 'bold', fontSize: 15}}>{translate('lastScore') }</Text>
					<Text>{scoresQuery.data!.slice(-1)[0]!.score}</Text>
				</View>
			</View>
			<Text style={{ paddingBottom: 10 }}>{songQuery.data!.description}</Text>
			<List.Accordion
    			title={translate('chapters')}
    			expanded={chaptersOpen}
    			onPress={() => setChaptersOpen(!chaptersOpen)}>
    			{ chaptersQuery.isLoading && <LoadingComponent/>}
				{ !chaptersQuery.isLoading && chaptersQuery.data!.map((chapter) => 
					<>
						<List.Item
							key={chapter.id}
							title={chapter.name}
							description={`${translate('level')} ${chapter.difficulty} - ${formatDuration((chapter.end - chapter.start) * 1000)}`}
						/>
						<Divider />
					</>
				)}
    		</List.Accordion>
		</View>
	)
}

export default SongLobbyView;