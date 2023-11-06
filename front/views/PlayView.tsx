/* eslint-disable no-mixed-spaces-and-tabs */
import { StackActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState, createContext, useReducer } from 'react';
import { SafeAreaView, Platform } from 'react-native';
import Animated, {
	BounceIn,
	useSharedValue,
	withTiming,
	Easing,
	useAnimatedStyle,
	withSequence,
	withDelay,
} from 'react-native-reanimated';
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
	Image,
	PresenceTransition,
} from 'native-base';
import IconButton from '../components/IconButton';
import { Ionicons } from '@expo/vector-icons';
import { RouteProps, useNavigation } from '../Navigation';
import { transformQuery, useQuery } from '../Queries';
import API from '../API';
import LoadingComponent, { LoadingView } from '../components/Loading';
import { useSelector } from 'react-redux';
import { RootState } from '../state/Store';
import { translate } from '../i18n/i18n';
import { ColorSchemeType } from 'native-base/lib/typescript/components/types';
import { useStopwatch } from 'react-use-precision-timer';
import PartitionCoord from '../components/PartitionCoord';
import TextButton from '../components/TextButton';
import { MIDIAccess, MIDIMessageEvent, requestMIDIAccess } from '@arthi-chaud/react-native-midi';
import * as Linking from 'expo-linking';
import url from 'url';
import { PianoCanvasContext, PianoCanvasMsg, NoteTiming } from '../models/PianoGame';
import { MetronomeControls } from '../components/Metronome';
import PartitionMagic from '../components/Play/PartitionMagic';
import StarProgress from '../components/StarProgress';

type PlayViewProps = {
	songId: number;
	type: 'practice' | 'normal';
};

type ScoreMessage = {
	content: string;
	color?: ColorSchemeType;
};

// this a hot fix this should be reverted soon
let scoroBaseApiUrl = process.env.EXPO_PUBLIC_SCORO_URL!;

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

//create a context with an array of number
export const PianoCC = createContext<PianoCanvasContext>({
	pressedKeys: new Map(),
	timestamp: 0,
	messages: [],
});

const infoCardInfos = [
	{
		icon: <Ionicons name="timer-outline" size={18} color="#6075F9" />,
		label: 'Last Score',
		id: 'lastScore',
		value: 60,
	},
	{
		icon: <Ionicons name="trophy-outline" size={18} color="#6075F9" />,
		label: 'Best Score',
		id: 'bestScore',
		value: 60,
	},
	{
		icon: <Ionicons name="bar-chart-outline" size={18} color="#6075F9" />,
		label: 'Level',
		id: 'level',
		value: 3,
	},
] as const;

const PlayView = ({ songId, type, route }: RouteProps<PlayViewProps>) => {
	const accessToken = useSelector((state: RootState) => state.user.accessToken);
	const navigation = useNavigation();
	const song = useQuery(API.getSong(songId), { staleTime: Infinity });
	const toast = useToast();
	const [lastScoreMessage, setLastScoreMessage] = useState<ScoreMessage>();
	const webSocket = useRef<WebSocket>();
	const bpm = useRef<number>(60);
	const [paused, setPause] = useState<boolean>(true);
	const stopwatch = useStopwatch();
	const [time, setTime] = useState(0);
	const [partitionRendered, setPartitionRendered] = useState(false); // Used to know when partitionview can render
	const [score, setScore] = useState(0); // Between 0 and 100
	// const fadeAnim = useRef(new Animated.Value(0)).current;
	const musixml = useQuery(
		transformQuery(API.getSongMusicXML(songId), (data) => new TextDecoder().decode(data)),
		{ staleTime: Infinity }
	);
	const getElapsedTime = () => stopwatch.getElapsedRunningTime() - 3000;
	const [midiKeyboardFound, setMidiKeyboardFound] = useState<boolean>();
	// first number is the note, the other is the time when pressed on release the key is removed
	const [pressedKeys, setPressedKeys] = useState<Map<number, number>>(new Map()); // [note, time]
	const [pianoMsgs, setPianoMsgs] = useReducer(
		(state: PianoCanvasMsg[], action: PianoCanvasMsg) => {
			state.push(action);
			return state;
		},
		[]
	);
	const [streak, setStreak] = useState(0);
	const scoreMessageScale = useSharedValue(0);
	// this style should bounce in on enter and fade away
	const scoreMsgStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scoreMessageScale.value }],
		};
	});

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
		stopwatch.stop();
		if (webSocket.current?.readyState != WebSocket.OPEN) {
			console.warn('onEnd: Websocket not open');
			navigation.dispatch(StackActions.replace('Home', {}));
			return;
		}
		webSocket.current?.send(
			JSON.stringify({
				type: 'end',
			})
		);
	};

	const onMIDISuccess = (access: MIDIAccess) => {
		const inputs = access.inputs;
		let endMsgReceived = false; // Used to know if to go to error screen when websocket closes

		if (inputs.size < 2) {
			toast.show({ description: 'No MIDI Keyboard found' });
			return;
		}
		setMidiKeyboardFound(true);
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
		webSocket.current.onclose = () => {
			console.log('Websocket closed', endMsgReceived);
			if (!endMsgReceived) {
				toast.show({ description: 'Connection lost with Scorometer' });
				// the special case when the front send the end message succesfully
				// but the websocket is closed before the end message is received
				// is not handled
				return;
			}
		};
		webSocket.current.onmessage = (message) => {
			try {
				const data = JSON.parse(message.data);
				if (data.type == 'end') {
					endMsgReceived = true;
					webSocket.current?.close();
					navigation.dispatch(
						StackActions.replace('Score', { songId: song.data!.id, ...data })
					);
					return;
				}

				const currentStreak = data.info.current_streak;
				const points = data.info.score;
				const maxPoints = data.info.max_score || 1;

				if (currentStreak !== undefined && points !== undefined) {
					setPianoMsgs({
						type: 'scoreInfo',
						data: { streak: currentStreak, score: points },
					});
				}

				setScore(Math.floor((Math.max(points, 0) * 100) / maxPoints));

				let formattedMessage = '';
				let messageColor: ColorSchemeType | undefined;

				if (data.type == 'miss') {
					formattedMessage = translate('missed');
					setPianoMsgs({
						type: 'noteTiming',
						data: NoteTiming.Missed,
					});
					messageColor = 'white';
				} else if (data.type == 'timing' || data.type == 'duration') {
					formattedMessage = translate(data[data.type]);
					switch (data[data.type]) {
						case 'perfect':
							messageColor = 'green';
							setPianoMsgs({
								type: 'noteTiming',
								data: NoteTiming.Perfect,
							});
							break;
						case 'great':
							messageColor = 'blue';
							setPianoMsgs({
								type: 'noteTiming',
								data: NoteTiming.Great,
							});
							break;
						case 'short':
						case 'long':
						case 'good':
							messageColor = 'lightBlue';
							setPianoMsgs({
								type: 'noteTiming',
								data: NoteTiming.Good,
							});
							break;
						case 'too short':
						case 'too long':
						case 'wrong':
							messageColor = 'trueGray';
							setPianoMsgs({
								type: 'noteTiming',
								data: NoteTiming.Wrong,
							});
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
			input.onmidimessage = (message) => {
				const { command, note } = parseMidiMessage(message);
				const keyIsPressed = command == 9;
				if (keyIsPressed) {
					setPressedKeys((prev) => {
						prev.set(note, getElapsedTime());
						return prev;
					});
				} else {
					setPressedKeys((prev) => {
						prev.delete(note);
						return prev;
					});
				}

				webSocket.current?.send(
					JSON.stringify({
						type: keyIsPressed ? 'note_on' : 'note_off',
						note: note,
						id: song.data!.id,
						time: getElapsedTime(),
					})
				);
			};
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
			stopwatch.stop();
			clearInterval(interval);
		};
	}, []);
	useEffect(() => {
		if (lastScoreMessage) {
			scoreMessageScale.value = withSequence(
				withTiming(1, {
					duration: 400,
					easing: Easing.elastic(3),
				}),
				withDelay(
					700,
					withTiming(0, {
						duration: 300,
						easing: Easing.out(Easing.cubic),
					})
				)
			);
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
		<SafeAreaView
			style={{
				flexGrow: 1,
				flexDirection: 'column',
				padding: 20,
				position: 'relative',
				backgroundColor: 'rgb(26, 36, 74)',
			}}
		>
			<View
				style={{
					position: 'absolute',
					top: 10,
					right: 10,
					display: 'flex',
					flexDirection: 'row',
					gap: 20,
					borderRadius: 12,
					backgroundColor: 'rgba(16, 16, 20, 0.5)',
					padding: 10,
					paddingHorizontal: 20,
				}}
			>
				{infoCardInfos.map((info) => (
					<View
						key={info.id}
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Text fontSize={12}>{info.label}</Text>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap: 5,
							}}
						>
							{info.icon}
							<Text fontSize={12} bold>
								{info.value}
							</Text>
						</View>
					</View>
				))}
			</View>
			<View
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 3,
				}}
			>
				<View>
					<Text fontSize={24}>{score}</Text>
				</View>
				<Animated.View style={[scoreMsgStyle]}>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 7,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Text fontSize={20} color={'white'}>
							{lastScoreMessage?.content}
						</Text>
						<Text fontSize={15} bold>
							{streak > 0 && `x${streak}`}
						</Text>
					</View>
				</Animated.View>
			</View>
			<View
				style={{
					flexGrow: 1,
					justifyContent: 'center',
					borderRadius: 10,
					overflow: 'hidden',
					backgroundColor: 'white',
				}}
			>
				<PianoCC.Provider
					value={{
						pressedKeys: pressedKeys,
						timestamp: time,
						messages: pianoMsgs,
					}}
				>
					<PartitionMagic
						songID={song.data.id}
						onReady={() => setPartitionRendered(true)}
						onEndReached={onEnd}
						onError={() => {
							console.log('error from partition magic');
						}}
					/>
				</PianoCC.Provider>
				{!partitionRendered && <LoadingComponent />}
			</View>

			<Row
				justifyContent="space-between"
				style={{
					display: 'flex',
					flexGrow: 0,
					flexShrink: 0,
					alignItems: 'center',
					borderRadius: 12,
					backgroundColor: 'rgba(16, 16, 20, 0.5)',
					//@ts-expect-error backdropFilter is not in the types
					backdropFilter: 'blur(2px)',
					padding: 10,
					marginTop: 20,
				}}
			>
				<View
					style={{
						flexGrow: 0,
						flexShrink: 3,
						justifyContent: 'center',
						alignItems: 'center',
						marginRight: 40,
					}}
				>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 20,
							maxWidth: '100%',
						}}
					>
						<Image
							src={song.data.cover}
							alt="cover"
							size={'sm'}
							borderRadius={8}
							style={{
								flexShrink: 0,
							}}
						/>
						<View
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								gap: 8,
								flex: 1,
							}}
						>
							<Text fontSize={14} maxW={'100%'} isTruncated>
								{song.data.name}
							</Text>
							<Text fontSize={12} maxW={'100%'} isTruncated>
								{song.data.artistId}
							</Text>
						</View>
					</View>
				</View>
				<View
					style={{
						flexGrow: 1,
						flexShrink: 0,
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						gap: 25,
					}}
				>
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
					{midiKeyboardFound && (
						<>
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
					<Text>
						{time < 0
							? paused
								? '0:00'
								: Math.floor((time % 60000) / 1000)
										.toFixed(0)
										.toString()
							: `${Math.floor(time / 60000)}:${Math.floor((time % 60000) / 1000)
									.toFixed(0)
									.toString()
									.padStart(2, '0')}`}
					</Text>
					<StarProgress
						value={score}
						max={100}
						starSteps={[50, 75, 90]}
						style={{
							flexGrow: 1,
							flexShrink: 1,
							marginTop: 10,
							marginBottom: 10,
							minWidth: 200,
						}}
					/>
				</View>
				<View
					style={{
						flex: 1,
						justifyContent: 'space-evenly',
						alignItems: 'center',
						flexDirection: 'row',
						marginLeft: 40,
						maxWidth: 250,
						minWidth: 120,
					}}
				>
					<MetronomeControls paused={paused} bpm={bpm.current} />
				</View>
			</Row>
		</SafeAreaView>
	);
};

export default PlayView;
