import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import {  Box, Center, Column, Progress, Text, Row, View, useToast, Icon } from 'native-base';
import IconButton from '../components/IconButton';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, RouteProps } from "../Navigation";
import { useQuery, useQueryClient } from 'react-query';
import API from '../API';
import { LoadingView } from '../components/Loading';
import Constants from 'expo-constants';
import SlideView from '../components/PartitionVisualizer/SlideView';
import MidiPlayer from 'midi-player-js';
import SoundFont from 'soundfont-player';
import VirtualPiano from '../components/VirtualPiano/VirtualPiano';
import { strToKey, keyToStr, Note } from '../models/Piano';
import { useSelector } from 'react-redux';
import { RootState } from '../state/Store';
import { translate } from '../i18n/i18n';
import { ColorSchemeType } from 'native-base/lib/typescript/components/types';
import { useStopwatch } from "react-use-precision-timer";

type PlayViewProps = {
	songId: number,
	type: 'practice' | 'normal'
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

const PlayView = ({ songId, type, route }: RouteProps<PlayViewProps>) => {
	const accessToken = useSelector((state: RootState) => state.user.accessToken);
	const navigation = useNavigation();
	const queryClient = useQueryClient();
	const song = useQuery(['song', songId], () => API.getSong(songId));
	const toast = useToast();
	const webSocket = useRef<WebSocket>();
	const [paused, setPause] = useState<boolean>(true);
	const stopwatch = useStopwatch();
	const [midiPlayer, setMidiPlayer] = useState<MidiPlayer.Player>();
	const [isVirtualPianoVisible, setVirtualPianoVisible] = useState<boolean>(false);
	const [time, setTime] = useState(0);
	const [score, setScore] = useState(0); // Between 0 and 100
	const [midiKeyboardFound, setMidiKeyboardFound] = useState<boolean>();
	const partitionRessources = useQuery(["partition", songId], () =>
		API.getPartitionRessources(songId)
	);

	const onPause = () => {
		midiPlayer?.pause();
		stopwatch.pause();
		setPause(true);
		webSocket.current?.send(JSON.stringify({
			type: "pause",
			paused: true,
			time: time
		}));
	}
	const onResume = () => {
		if (stopwatch.isStarted()) {
			stopwatch.resume();
		} else {
			stopwatch.start();
		}
		setPause(false);
		midiPlayer?.play();
		webSocket.current?.send(JSON.stringify({
			type: "pause",
			paused: false,
			time: time
		}));
	}
	const onEnd = () => {
		webSocket.current?.send(JSON.stringify({
			type: "end"
		}));
		stopwatch.stop();
		webSocket.current?.close();
		midiPlayer?.pause();
	}

	const onMIDISuccess = (access) => {
		const inputs = access.inputs;
		
		if (inputs.size < 2) {
			toast.show({ description: 'No MIDI Keyboard found' });
			return;
		}
		setMidiKeyboardFound(true);
		let inputIndex = 0;
		webSocket.current = new WebSocket(scoroBaseApiUrl);
		webSocket.current.onopen = () => {
			webSocket.current!.send(JSON.stringify({
				type: "start",
				id: song.data!.id,
				mode: type,
				bearer: accessToken
			}));
		};
		webSocket.current.onmessage = (message) => {
			try {
				const data = JSON.parse(message.data);
				if (data.type == 'end') {
					navigation.navigate('Score', { songId: song.data!.id });
					return;
				}
				const points = data.info.score;
				const maxPoints = data.info.maxScore;

				setScore(Math.floor(Math.max(points, 0) / maxPoints) * 100);

				let formattedMessage = '';
				let messageColor: ColorSchemeType | undefined;

				if (data.type == 'miss') {
					formattedMessage = translate('missed');
					messageColor = 'black';
				} else if (data.type == 'timing' || data.type == 'duration') {
					formattedMessage = translate(data[data.type]);
					switch (data[data.type]) {
						case 'perfect':
							messageColor = 'fuchsia';
							break;
						case 'great':
							messageColor = 'green';
							break;
						case 'short':
						case 'long':
						case 'good':
							messageColor = 'lightBlue';
							break;
						case 'too short':
						case 'too long':
						case 'wrong':
							messageColor = 'grey';
							break;
						default:
							break;
					}
				} 
				toast.show({ description: formattedMessage, placement: 'top', colorScheme: messageColor ?? 'secondary' });
			} catch (e) {
				console.log(e);
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
					note: keyCode,
					id: song.data!.id,
					time: time
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
		let interval = setInterval(() => setTime(() => stopwatch.getElapsedRunningTime()), 1);

		return () => {
			ScreenOrientation.unlockAsync().catch(() => {});
			onEnd();
			clearInterval(interval);
		}
	}, []);
	useEffect(() => {
		if (song.data) {
			navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
		}

	}, [song.data]);

	if (!song.data || !partitionRessources.data) {
		return <LoadingView/>;
	}
	return (
		<SafeAreaView style={{ flexGrow: 1, flexDirection: 'column' }}>
			<View style={{ flexGrow: 1 }}>
				{/* <SlideView sources={partitionRessources.data} speed={200} startAt={0} /> */}
			</View>

			{isVirtualPianoVisible && <Column
				style={{
					display: 'flex',
					justifyContent: "flex-end",
					alignItems: "center",
					height: '20%',
					width: '100%',
				}}
			>
				<VirtualPiano
					onNoteDown={(note: any) => {
						console.log("On note down", keyToStr(note));
					}}
					onNoteUp={(note: any) => {
						console.log("On note up", keyToStr(note));
					}}
					showOctaveNumbers={true}
					startNote={Note.C}
					endNote={Note.B}
					startOctave={2}
					endOctave={5}
					style={{
						width: '80%',
						height: '100%',
					}}
					highlightedNotes={
						[
							{ key: strToKey("D3") },
							{ key: strToKey("A#"), bgColor: "#00FF00" },
						]
					}

				/>
			</Column>}
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
					{midiKeyboardFound && <>
						<IconButton size='sm' variant='solid' icon={
							<Icon as={Ionicons} name={paused ? "play" : "pause"}/>
						} onPress={() => { 
							if (paused) {
								onResume();
							} else {
								onPause();
							}
						}}/>
						<IconButton size='sm' colorScheme='coolGray' variant='solid' icon={
							<Icon as={MaterialCommunityIcons}
							 name={ isVirtualPianoVisible ? "piano-off" : "piano"} />
						} onPress={() => {
							setVirtualPianoVisible(!isVirtualPianoVisible);
						}}/>
						<Text>{Math.floor(time / 60000)}:{Math.floor((time % 60000) / 1000).toFixed(0).toString().padStart(2, '0')}</Text>
						<IconButton size='sm' colorScheme='coolGray' variant='solid' opacity={time ?? 1} disabled={time == 0} icon={
							<Icon as={Ionicons} name="stop"/>
						} onPress={() => {
							onEnd();
							navigation.navigate('Score', { songId: song.data.id });
						}}/>
					</>}
					</Row>
				</Row>
			</Box>
		</SafeAreaView>
	);
}

export default PlayView