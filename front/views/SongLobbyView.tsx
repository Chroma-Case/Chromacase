import { useRoute } from "@react-navigation/native";
import { Image, View } from "react-native"
import { Surface, Text } from "react-native-paper";
import API from "../API";
import { useQuery } from 'react-query';
import LoadingComponent from "../components/loading";
import React, { useEffect } from "react";
import logo from '../assets/cover.png';

interface SongLobbyProps {
	// The unique identifier to find a song
	songId: number;
}

const SongLobbyView = () => {
	const route = useRoute();
	const props: SongLobbyProps = route.params as any;
	const { isLoading, data } = useQuery(['song', props.songId], () => API.getSong(props.songId));
	useEffect(() => {}, [isLoading]);
	if (isLoading)
		return <View style={{ flexGrow: 1, justifyContent: 'center' }}>
			<LoadingComponent/>
		</View>
	return (
		<View style={{ padding: 30 }}>
			<View style={{ flexDirection: 'row' }}>
				<View style={{ flex: 3 }}>
					<Surface style={{ aspectRatio: 1, zIndex: 0 }}>
						<Image source={logo} style={{ height: '100%', width: undefined, resizeMode: 'contain' }}/>
					</Surface>
				</View>
				<View style={{ flex: 3, padding: 10 }}>
					<Text>{data.title}</Text>
					<Text></Text>
				</View>
			</View>
			<View style={{ paddingVertical: 10 }}/>
			<Text>{data.description}</Text>
		</View>
	)
}

export default SongLobbyView;