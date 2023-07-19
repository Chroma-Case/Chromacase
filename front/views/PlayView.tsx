/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Platform, Animated } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import {
	Box,
	Center,
	Column,
	Progress,
	Text,
	Row,
	View,
	useToast,
	Icon,
	HStack,
} from 'native-base';
import IconButton from '../components/IconButton';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProps, useNavigation } from '../Navigation';
import { transformQuery, useQuery } from '../Queries';
import API from '../API';
import LoadingComponent, { LoadingView } from '../components/Loading';
import Constants from 'expo-constants';
import VirtualPiano from '../components/VirtualPiano/VirtualPiano';
import { strToKey, keyToStr, Note } from '../models/Piano';
import { useSelector } from 'react-redux';
import { RootState } from '../state/Store';
import { translate } from '../i18n/i18n';
import { ColorSchemeType } from 'native-base/lib/typescript/components/types';
import { useStopwatch } from 'react-use-precision-timer';
import PartitionView from '../components/PartitionView';
import PartitionCoord from '../components/PartitionCoord';
import TextButton from '../components/TextButton';
import { MIDIAccess, MIDIMessageEvent, requestMIDIAccess } from '@motiz88/react-native-midi';
import * as Linking from 'expo-linking';
import url from 'url';

type PlayViewProps = {
	songId: number;
	type: 'practice' | 'normal';
};

type ScoreMessage = {
	content: string;
	color?: ColorSchemeType;
};

// this a hot fix this should be reverted soon
let scoroBaseApiUrl = Constants.manifest?.extra?.scoroUrl;

if (process.env.NODE_ENV != 'development' && Platform.OS === 'web') {
	Linking.getInitialURL().then((initUrl) => {
		if (initUrl !== null) {
			const location = url.parse(initUrl);
			if (location.protocol === 'https:') {
				scoroBaseApiUrl = 'wss://' + location.host + '/ws';
			} else {
				scoroBaseApiUrl = 'ws://' + location.host + '/ws';
			}
		}
	});
}

function parseMidiMessage(message: MIDIMessageEvent) {
	return {
		command: message.data.at(0)! >> 4,
		channel: message.data.at(0)! & 0xf,
		note: message.data.at(1)!,
		velocity: message.data.at(2)! / 127,
	};
}

const PlayView = ({ songId, type, route }: RouteProps<PlayViewProps>) => {
	const accessToken = useSelector((state: RootState) => state.user.accessToken);
	const navigation = useNavigation();
	const song = useQuery(API.getSong(songId), { staleTime: Infinity });
	const toast = useToast();
	const [lastScoreMessage, setLastScoreMessage] = useState<ScoreMessage>();
	const webSocket = useRef<WebSocket>();
	const [paused, setPause] = useState<boolean>(true);
	const stopwatch = useStopwatch();
	const [isVirtualPianoVisible, setVirtualPianoVisible] = useState<boolean>(false);
	const [time, setTime] = useState(0);
	const [partitionRendered, setPartitionRendered] = useState(false); // Used to know when partitionview can render
	const [score, setScore] = useState(0); // Between 0 and 100
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const musixml = useQuery(
		transformQuery(API.getSongMusicXML(songId), (data) => new TextDecoder().decode(data)),
		{ staleTime: Infinity }
	);
	const getElapsedTime = () => stopwatch.getElapsedRunningTime() - 3000;
	const [midiKeyboardFound, setMidiKeyboardFound] = useState<boolean>();

	const onPause = () => {
		stopwatch.pause();
		setPause(true);
		webSocket.current?.send(
			JSON.stringify({
				type: 'pause',
				paused: true,
				time: getElapsedTime(),
			})
		);
	};
	const onResume = () => {
		if (stopwatch.isStarted()) {
			stopwatch.resume();
		} else {
			stopwatch.start();
		}
		setPause(false);
		webSocket.current?.send(
			JSON.stringify({
				type: 'pause',
				paused: false,
				time: getElapsedTime(),
			})
		);
	};
	const onEnd = () => {
		webSocket.current?.send(
			JSON.stringify({
				type: 'end',
			})
		);
	};

	const onMIDISuccess = (access: MIDIAccess) => {
		const inputs = access.inputs;

		if (inputs.size < 2) {
			toast.show({ description: 'No MIDI Keyboard found' });
			return;
		}
		setMidiKeyboardFound(true);
		let inputIndex = 0;
		webSocket.current = new WebSocket(scoroBaseApiUrl);
		webSocket.current.onopen = () => {
			webSocket.current!.send(
				JSON.stringify({
					type: 'start',
					id: song.data!.id,
					mode: type,
					bearer: accessToken,
				})
			);
		};
		webSocket.current.onmessage = (message) => {
			try {
				const data = JSON.parse(message.data);
				if (data.type == 'end') {
					navigation.navigate('Score', { songId: song.data!.id, ...data });
					return;
				}
				const points = data.info.score;
				const maxPoints = data.info.max_score || 1;

				setScore(Math.floor((Math.max(points, 0) * 100) / maxPoints));

				let formattedMessage = '';
				let messageColor: ColorSchemeType | undefined;

				if (data.type == 'miss') {
					formattedMessage = translate('missed');
					messageColor = 'black';
				} else if (data.type == 'timing' || data.type == 'duration') {
					formattedMessage = translate(data[data.type]);
					switch (data[data.type]) {
						case 'perfect':
							messageColor = 'green';
							break;
						case 'great':
							messageColor = 'blue';
							break;
						case 'short':
						case 'long':
						case 'good':
							messageColor = 'lightBlue';
							break;
						case 'too short':
						case 'too long':
						case 'wrong':
							messageColor = 'trueGray';
							break;
						default:
							break;
					}
				}
				setLastScoreMessage({ content: formattedMessage, color: messageColor });
			} catch (e) {
				console.error(e);
			}
		};
		inputs.forEach((input) => {
			if (inputIndex != 0) {
				return;
			}
			input.onmidimessage = (message) => {
				const { command } = parseMidiMessage(message);
				const keyIsPressed = command == 9;
				const keyCode = message.data[1];
				webSocket.current?.send(
					JSON.stringify({
						type: keyIsPressed ? 'note_on' : 'note_off',
						note: keyCode,
						id: song.data!.id,
						time: getElapsedTime(),
					})
				);
			};
			inputIndex++;
		});
	};
	const onMIDIFailure = () => {
		toast.show({ description: `Failed to get MIDI access` });
	};

	useEffect(() => {
		ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => {});
		const interval = setInterval(() => {
			setTime(() => getElapsedTime()); // Countdown
		}, 1);

		return () => {
			ScreenOrientation.unlockAsync().catch(() => {});
			onEnd();
			clearInterval(interval);
		};
	}, []);
	useEffect(() => {
		if (lastScoreMessage) {
			fadeAnim.setValue(1);
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 3000,
				useNativeDriver: true,
			}).start();
		}
	}, [lastScoreMessage]);
	useEffect(() => {
		// Song.data is updated on navigation.navigate (do not know why)
		// Hotfix to prevent midi setup process from reruning on game end
		if (navigation.getState().routes.at(-1)?.name != route.name) {
			return;
		}
		if (song.data && !webSocket.current && partitionRendered) {
			requestMIDIAccess().then(onMIDISuccess).catch(onMIDIFailure);
		}
	}, [song.data, partitionRendered]);

	if (!song.data || !musixml.data) {
		return <LoadingView />;
	}
	return (
		<SafeAreaView style={{ flexGrow: 1, flexDirection: 'column' }}>
			<HStack
				width="100%"
				justifyContent="center"
				p={3}
				style={{ position: 'absolute', top: 1 }}
			>
				<Animated.View style={{ opacity: fadeAnim }}>
					<TextButton
						disabled
						label={lastScoreMessage?.content ?? ''}
						colorScheme={lastScoreMessage?.color}
						rounded="sm"
					/>
				</Animated.View>
			</HStack>
			<View style={{ flexGrow: 1, justifyContent: 'center' }}>
				{/* <PartitionView
					file={musixml.data}
					onPartitionReady={() => setPartitionRendered(true)}
					timestamp={Math.max(0, time)}
					onEndReached={() => {
						onEnd();
					}}
				/> */}
				<PartitionCoord
					file={musixml.data}
					timestamp={Math.max(0, time)}
					onEndReached={() => {
						onEnd();
					}}
					onPartitionReady={() => setPartitionRendered(true)}
				/>
				{!partitionRendered && <LoadingComponent />}
			</View>

			{isVirtualPianoVisible && (
				<Column
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						alignItems: 'center',
						height: '20%',
						width: '100%',
					}}
				>
					<VirtualPiano
						onNoteDown={(note) => {
							console.log('On note down', keyToStr(note));
						}}
						onNoteUp={(note) => {
							console.log('On note up', keyToStr(note));
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
						highlightedNotes={[
							{ key: strToKey('D3') },
							{ key: strToKey('A#'), bgColor: '#00FF00' },
						]}
					/>
				</Column>
			)}
			<Box
				shadow={4}
				style={{
					height: '12%',
					width: '100%',
					borderWidth: 0.5,
					margin: 5,
					display: !partitionRendered ? 'none' : undefined,
				}}
			>
				<Row justifyContent="space-between" style={{ flexGrow: 1, alignItems: 'center' }}>
					<Column
						space={2}
						style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
					>
						<Text style={{ fontWeight: 'bold' }}>Score: {score}%</Text>
						<Progress value={score} style={{ width: '90%' }} />
					</Column>
					<Center style={{ flex: 1, alignItems: 'center' }}>
						<Text style={{ fontWeight: '700' }}>{song.data.name}</Text>
					</Center>
					<Row
						style={{
							flex: 1,
							height: '100%',
							justifyContent: 'space-evenly',
							alignItems: 'center',
						}}
					>
						{midiKeyboardFound && (
							<>
								<IconButton
									size="sm"
									variant="solid"
									icon={<Icon as={Ionicons} name={paused ? 'play' : 'pause'} />}
									onPress={() => {
										if (paused) {
											onResume();
										} else {
											onPause();
										}
									}}
								/>
								<IconButton
									size="sm"
									colorScheme="coolGray"
									variant="solid"
									icon={
										<Icon
											as={MaterialCommunityIcons}
											name={isVirtualPianoVisible ? 'piano-off' : 'piano'}
										/>
									}
									onPress={() => {
										setVirtualPianoVisible(!isVirtualPianoVisible);
									}}
								/>
								<Text>
									{time < 0
										? paused
											? '0:00'
											: Math.floor((time % 60000) / 1000)
													.toFixed(0)
													.toString()
										: `${Math.floor(time / 60000)}:${Math.floor(
												(time % 60000) / 1000
										  )
												.toFixed(0)
												.toString()
												.padStart(2, '0')}`}
								</Text>
								<IconButton
									size="sm"
									colorScheme="coolGray"
									variant="solid"
									icon={<Icon as={Ionicons} name="stop" />}
									onPress={() => {
										onEnd();
									}}
								/>
							</>
						)}
					</Row>
				</Row>
			</Box>
		</SafeAreaView>
	);
};

export default PlayView;
