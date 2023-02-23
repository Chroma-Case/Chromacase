import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import {  Box, Center, Column, IconButton, Progress, Row, View, useToast } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useQuery, useQueryClient } from 'react-query';
import API from '../API';
import LoadingComponent from '../components/Loading';
import Constants from 'expo-constants';
import { useStopwatch } from 'react-timer-hook';
import SlideView from '../components/PartitionVisualizer/SlideView';
import MidiPlayer from 'midi-player-js';
import SoundFont from 'soundfont-player';

type PlayViewProps = {
	songId: number
}


// this a hot fix this should be reverted soon
let scoroBaseApiUrl = Constants.manifest?.extra?.scoroUrl;

if (process.env.NODE_ENV != 'development' && Platform.OS === 'web') {
	if (location.protocol === 'https:') {
		scoroBaseApiUrl = "wss://" + location.host + "/ws";
	} else {
		scoroBaseApiUrl = "ws://" + location.host + "/ws";
	}
}

const PlayView = () => {
	const songId = 1;
	const navigation = useNavigation();
	const queryClient = useQueryClient();
	const song = useQuery(['song', songId], () => API.getSong(songId));
	const toast = useToast();
	const webSocket = useRef<WebSocket>();
	const timer = useStopwatch({ autoStart: false });
	const [paused, setPause] = useState<boolean>(true);
	const [midiPlayer, setMidiPlayer] = useState<MidiPlayer.Player>();
	
	const partitionRessources = useQuery(["partition", songId], () =>
		API.getPartitionRessources(songId)
	);

	const onPause = () => {
		timer.pause();
		midiPlayer?.pause();
		setPause(true);
		webSocket.current?.send(JSON.stringify({
			type: "pause",
			paused: true,
			time: Date.now()
		}));
	}
	const onResume = () => {
		setPause(false);
		midiPlayer?.play();
		timer.start();
		webSocket.current?.send(JSON.stringify({
			type: "pause",
			paused: false,
			time: Date.now()
		}));
	}
	const onEnd = () => {
		webSocket.current?.close();
		midiPlayer?.pause();
	}

	const onMIDISuccess = (access) => {
		const inputs = access.inputs;
		
		if (inputs.size < 2) {
			toast.show({ description: 'No MIDI Keyboard found' });
			return;
		}
		toast.show({ description: `MIDI ready!`, placement: 'top' });
		let inputIndex = 0;
		webSocket.current = new WebSocket(scoroBaseApiUrl);
		webSocket.current.onopen = () => {
			webSocket.current!.send(JSON.stringify({
				type: "start",
				name: "clair-de-lune" /*song.data.id*/,
			}));
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
		Promise.all([
			queryClient.fetchQuery(['song', songId, 'midi'], () => API.getSongMidi(songId)),
			SoundFont.instrument(new AudioContext(), 'electric_piano_1'),
		]).then(([midiFile, audioController]) => {
			const player = new MidiPlayer.Player((event) => {
				if (event['noteName']) {
					console.log(event);
					audioController.play(event['noteName']);
				}
			});
			player.loadArrayBuffer(midiFile);
			setMidiPlayer(player);
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
							name: paused ? "play" : "pause"
						}} onPress={() => { 
							if (paused) {
								onResume();
							} else {
								onPause();
							}
						}}/>
						<Text>{timer.minutes}:{timer.seconds.toString().padStart(2, '0')}</Text>
						<IconButton size='sm' colorScheme='coolGray' variant='solid' _icon={{
							as: Ionicons,
							name: "stop"
						}} onPress={() => {
							onEnd();
							navigation.navigate('Score')
						}}/>
					</Row>
				</Row>
			</Box>
		</SafeAreaView>
	);
}

export default PlayView