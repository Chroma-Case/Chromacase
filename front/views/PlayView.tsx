import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import {  Box, Center, Column, IconButton, Progress, Row, View, useToast } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useQuery } from 'react-query';
import API from '../API';
import LoadingComponent from '../components/Loading';

type PlayViewProps = {
	songId: number
}

const PlayView = ({ songId }: PlayViewProps) => {
	const navigation = useNavigation();
	const song = useQuery(['song'], () => API.getSong(songId));
	const toast = useToast();
	const webSocket = useRef<WebSocket>();
	const timer = useRef<NodeJS.Timer>();
	// If paused is undefined, it means the song as not started yet
	const [paused, setPause] = useState<boolean>();

	const onPause = () => {
		setPause(true);
		webSocket.current?.send(JSON.stringify({
			type: "pause",
			paused: true,
			time: Date.now()
		}));
	}
	const onResume = () => {
		setPause(false);
		webSocket.current?.send(JSON.stringify({
			type: "pause",
			paused: false,
			time: Date.now()
		}));
	}
	const onEnd = () => {
		webSocket.current?.close();
	}

	const onMIDISuccess = (access) => {
		const inputs = access.inputs;
		webSocket.current?.send(JSON.stringify({
			type: "start",
			paused: false,
			time: Date.now()
		}));
		
		if (inputs.size < 1) {
			return;
		}
		toast.show({ description: `MIDI ready!`, placement: 'top' });
		let inputIndex = 0;
		webSocket.current = new WebSocket(process.env.SCORO_URL!);
		webSocket.current.send(JSON.stringify({
			type: "start",
			name: "clair-de-lune" /*song.data.id*/,
		}));
		webSocket.current.onmessage = (message) => {
			toast.show({ description: message.data });
		}
		setPause(false);
		inputs.forEach((input) => {
			if (inputIndex != 0) {
				return;
			}
			input.onmidimessage = (message) => {
				const keyIsPressed = message.data[2] == 100;
				const keyCode = message.data[1];
				webSocket.current?.send(JSON.stringify({
					type: keyIsPressed ? "note_on" : "note_off",
					node: keyCode,
					intensity: null,
					time: Date.now()
				}))
			}
			inputIndex++;
		});
	}
	const onMIDIFailure = () => {
		toast.show({ description: `Failed to get MIDI access` });
	}
	useEffect(() => {
		ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => {});
		navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

		return () => {
			ScreenOrientation.unlockAsync().catch(() => {});
			onEnd();
		}
	}, [])
	const score = 20;

	if (!song.data) {
		return <Center style={{ flexGrow: 1 }}>
			<LoadingComponent/>
		</Center>
	}
	return (
		<SafeAreaView style={{ flexGrow: 1, flexDirection: 'column' }}>
			<View style={{ flexGrow: 1 }}>
			</View>
			<Box shadow={4} style={{ height: '12%', width:'100%', borderWidth: 0.5, margin: 5 }}>
				<Row justifyContent='space-between' style={{ flexGrow: 1, alignItems: 'center' }} >
					<Column space={2} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<Text style={{ fontWeight: 'bold' }}>Score: {score}%</Text>
						<Progress value={score} style={{ width: '90%' }}/>
					</Column>
					<Center style={{ flex: 1, alignItems: 'center' }}>
						<Text style={{ fontWeight: '700' }}>Rolling in the Deep</Text>
					</Center>
					<Row style={{ flex: 1, height: '100%', justifyContent: 'space-evenly', alignItems: 'center'  }}>
						<IconButton size='sm' colorScheme='secondary' variant='solid'  _icon={{
						    as: Ionicons,
						    name: "play-back"
						}}/>
						<IconButton size='sm'  variant='solid'  _icon={{
						    as: Ionicons,
						    name: paused === false ? "pause" : "play"
						}} onPress={() => { 
							if (paused == true) {
								onResume();
							} else if (paused === false) {
								onPause();
							}
						 }}/>
						<Text>0:30</Text>
						<IconButton size='sm' colorScheme='coolGray' variant='solid' _icon={{
						    as: Ionicons,
						    name: "stop"
						}} onPress={() => navigation.navigate('Score')}/>
					</Row>
				</Row>
			</Box>
		</SafeAreaView>
	);
}

export default PlayView