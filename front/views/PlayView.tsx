import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import {  Box, Center, Column, IconButton, Progress, Row, View, useToast } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useQuery } from 'react-query';
import API from '../API';
import LoadingComponent from '../components/Loading';
import Constants from 'expo-constants';
import { useStopwatch } from 'react-timer-hook';
import PartitionVisualizer from '../components/PartitionVisualizer/PartitionVisualizer';
import SlideView from '../components/PartitionVisualizer/SlideView';

type PlayViewProps = {
	songId: number
}

const PlayView = ({ songId }: PlayViewProps) => {
	const navigation = useNavigation();
	const song = useQuery(['song'], () => API.getSong(songId));
	const toast = useToast();
	const webSocket = useRef<WebSocket>();
	const timer = useStopwatch({ autoStart: false });
	const [paused, setPause] = useState<boolean>();
	const partitionRessources = useQuery(["partition"], () =>
		API.getPartitionRessources(songId)
	);

	const onPause = () => {
		timer.pause();
		setPause(true);
		webSocket.current?.send(JSON.stringify({
			type: "pause",
			paused: true,
			time: Date.now()
		}));
	}
	const onResume = () => {
		setPause(false);
		timer.start();
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
		
		if (inputs.size < 2) {
			toast.show({ description: 'No MIDI Keyboard found' });
			return;
		}
		toast.show({ description: `MIDI ready!`, placement: 'top' });
		let inputIndex = 0;
		webSocket.current = new WebSocket(Constants.manifest?.extra?.scoroUrl);
		webSocket.current.onopen = () => {
			webSocket.current!.send(JSON.stringify({
				type: "start",
				name: "clair-de-lune" /*song.data.id*/,
			}));
			timer.start();
		};
		webSocket.current.onmessage = (message) => {
			try {
				const data = JSON.parse(message.data);
				if (data.type == 'end') {
					navigation.navigate('Score');
				} else if (data.song_launched == undefined) {
					toast.show({ description: data, placement: 'top', colorScheme: 'secondary' });
				}
			} catch {

			}
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
			clearInterval(timer);
			onEnd();
		}
	}, [])
	const score = 20;

	if (!song.data || !partitionRessources.data) {
		return <Center style={{ flexGrow: 1 }}>
			<LoadingComponent/>
		</Center>
	}
	return (
		<SafeAreaView style={{ flexGrow: 1, flexDirection: 'column' }}>
			<View style={{ flexGrow: 1 }}>
				<SlideView sources={partitionRessources.data} speed={200} startAt={0} />
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
						<IconButton size='sm' variant='solid' _icon={{
						    as: Ionicons,
						    name: paused === false ? "pause" : "play"
						}} onPress={() => { 
							if (paused == true) {
								onResume();
							} else if (paused === false) {
								onPause();
							}
						 }}/>
						<Text>{timer.minutes}:{timer.seconds.toString().padStart(2, '0')}</Text>
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