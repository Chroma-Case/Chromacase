/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Text, Row, View, useToast } from 'native-base';
import { useNavigation } from '../Navigation';
import { useQuery } from '../Queries';
import API from '../API';
import { LoadingView } from '../components/Loading';
import { useSelector } from 'react-redux';
import { RootState } from '../state/Store';
import { Translate, translate } from '../i18n/i18n';
import { ColorSchemeType } from 'native-base/lib/typescript/components/types';
import { useStopwatch } from 'react-use-precision-timer';
import { MIDIAccess, MIDIMessageEvent, requestMIDIAccess } from '@motiz88/react-native-midi';
import * as Linking from 'expo-linking';
import url from 'url';
import PartitionMagic from '../components/Play/PartitionMagic';
import useColorScheme from '../hooks/colorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, useBreakpointValue } from 'native-base';
import PopupCC from '../components/UI/PopupCC';
import ButtonBase from '../components/UI/ButtonBase';
import { Clock, Cup } from 'iconsax-react-native';
import PlayViewControlBar from '../components/Play/PlayViewControlBar';
import ScoreModal from '../components/ScoreModal';
import { PlayScore, ScoreMessage } from '../components/Play/PlayScore';

type PlayViewProps = {
	songId: number;
};

// this a hot fix this should be reverted soon
let scoroBaseApiUrl = process.env.EXPO_PUBLIC_SCORO_URL!;
let interval: NodeJS.Timeout;

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

const PlayView = ({ songId }: PlayViewProps) => {
	const [playType, setPlayType] = useState<'practice' | 'normal' | null>(null);
	const accessToken = useSelector((state: RootState) => state.user.accessToken);
	const navigation = useNavigation();
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isPhone = screenSize === 'small';
	const song = useQuery(API.getSong(songId, ['artist']), { staleTime: Infinity });
	const toast = useToast();
	const [lastScoreMessage, setLastScoreMessage] = useState<ScoreMessage>();
	const webSocket = useRef<WebSocket>();
	const [paused, setPause] = useState<boolean>(true);
	const stopwatch = useStopwatch();
	const [time, setTime] = useState(0);
	const [endResult, setEndResult] = useState<unknown>();
	const [shouldPlay, setShouldPlay] = useState(false);
	const songHistory = useQuery(API.getSongHistory(songId));
	const [score, setScore] = useState(0); // Between 0 and 100
	const getElapsedTime = () => stopwatch.getElapsedRunningTime();
	const [readyToPlay, setReadyToPlay] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [midiKeyboardFound, setMidiKeyboardFound] = useState<boolean>();
	// first number is the note, the other is the time when pressed on release the key is removed
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [streak, setStreak] = useState(0);
	const colorScheme = useColorScheme();
	const { colors } = useTheme();
	const statColor = colors.lightText;

	const onPause = () => {
		console.log('onPause');
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
			navigation.replace('Tabs', { screen: 'Home' });
			return;
		}
		webSocket.current?.send(
			JSON.stringify({
				type: 'end',
			})
		);
		API.updateUserTotalScore(score);
	};

	const onMIDISuccess = (access: MIDIAccess) => {
		const inputs = access.inputs;
		console.log('MIDI inputs', inputs);
		let endMsgReceived = false; // Used to know if to go to error screen when websocket closes

		if (inputs.size <= 0) {
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
					mode: playType,
					bearer: accessToken,
				})
			);
			interval = setInterval(() => {
				webSocket.current!.send(
					JSON.stringify({
						type: 'ping',
					})
				);
			}, 15000);
		};
		webSocket.current.onclose = () => {
			clearInterval(interval);
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
				if (data.error) {
					console.error('Scoro msg: ', data.error);
					toast.show({ description: 'Scoro: ' + data.error });
					return;
				}
				if (data.type == 'pong') return;
				if (data.type == 'end') {
					const maxPoints = data.score.max_score || 1;
					const points = data.overallScore;

					endMsgReceived = true;
					webSocket.current?.close();
					setScore(Math.floor((Math.max(points, 0) * 100) / maxPoints));
					setEndResult({ songId: song.data!.id, ...data });
					return;
				}

				const points = data.info.score;
				const maxPoints = data.info.max_score || 1;

				setScore(Math.floor((Math.max(points, 0) * 100) / maxPoints));

				if (data.type == 'step') {
					setTime(data.timestamp);
					return;
				}
				let formattedMessage = '';
				let messageColor: ColorSchemeType | undefined;

				if (data.type == 'miss') {
					formattedMessage = translate('missed');
					messageColor = 'white';
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
				setLastScoreMessage({
					content: formattedMessage,
					color: messageColor,
					id: (lastScoreMessage?.id ?? 0) + 1,
				});
			} catch (e) {
				console.error(e);
			}
		};
		inputs.forEach((input) => {
			input.onmidimessage = (message) => {
				const { command, note, velocity } = parseMidiMessage(message);
				let keyIsPressed = command == 9;
				if (velocity == 0) keyIsPressed = false;

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
			if (playType != 'practice') {
				setTime(() => getElapsedTime());
			} // Countdown
		}, 200);

		return () => {
			ScreenOrientation.unlockAsync().catch(() => {});
			stopwatch.stop();
			clearInterval(interval);
		};
	}, [playType]);

	useEffect(() => {
		// Song.data is updated on navigation.navigate (do not know why)
		// Hotfix to prevent midi setup process from reruning on game end
		if (navigation.getState().routes.at(-1)?.name != 'Play') {
			return;
		}
		if (playType && song.data && !webSocket.current) {
			requestMIDIAccess().then(onMIDISuccess).catch(onMIDIFailure);
		}
	}, [song.data, playType]);

	if (!song.data) {
		return <LoadingView />;
	}
	return (
		<View style={{ display: 'flex', flex: 1, backgroundColor: '#cdd4fd' }}>
			<SafeAreaView
				style={{
					flexGrow: 1,
					flexDirection: 'column',
					alignItems: 'stretch',
					padding: isPhone ? 7 : 20,
					gap: isPhone ? 7 : 20,
					position: 'relative',
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
						backgroundColor: 'rgba(16, 16, 20, 0.7)',
						padding: 10,
						paddingHorizontal: 20,
						zIndex: 100,
					}}
				>
					<PopupCC isVisible={endResult != undefined}>
						{
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							(() => (endResult ? <ScoreModal {...(endResult as any)} /> : <></>))()
						}
					</PopupCC>
					<PopupCC
						title={translate('selectPlayMode')}
						description={translate('selectPlayModeExplaination')}
						isVisible={playType == null}
						setIsVisible={
							navigation.canGoBack()
								? (isVisible) => {
										if (!isVisible) {
											// If we dismiss the popup, Go to previous page
											navigation.goBack();
										}
								  }
								: undefined
						}
					>
						<Row style={{ justifyContent: 'space-between' }}>
							<ButtonBase
								style={{}}
								type="outlined"
								title={translate('practiceBtn')}
								onPress={async () => {
									setPlayType('practice');
									setShouldPlay(true);
								}}
							/>
							<ButtonBase
								style={{}}
								type="filled"
								title={translate('playBtn')}
								onPress={async () => setPlayType('normal')}
							/>
						</Row>
					</PopupCC>
					{(
						[
							[
								'lastScore',
								songHistory.data?.history.at(0)?.score ?? 0,
								<Clock key={'lS'} color={statColor} />,
							] as const,
							[
								'bestScore',
								songHistory.data?.best ?? 0,
								<Cup key={'bS'} color={statColor} />,
							],
						] as const
					).map(([label, value, icon]) => (
						<View
							key={label}
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<Translate translationKey={label} color={statColor} fontSize={12} />
							<View
								style={{
									display: 'flex',
									flexDirection: 'row',
									gap: 5,
								}}
							>
								{icon}
								<Text color={statColor} fontSize={12} bold>
									{value}
								</Text>
							</View>
						</View>
					))}
				</View>
				<View
					style={{
						top: '5%',
						left: 0,
						zIndex: 100,
						width: '100%',
						position: 'absolute',
					}}
				>
					<PlayScore score={score} streak={streak} message={lastScoreMessage} />
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
					<PartitionMagic
						playType={playType}
						shouldPlay={shouldPlay}
						timestamp={time}
						songID={song.data.id}
						onEndReached={() => {
							setTimeout(() => {
								onEnd();
							}, 200);
						}}
						onError={() => {
							console.log('error from partition magic');
						}}
						onReady={() => {
							console.log('ready from partition magic');
							setReadyToPlay(true);
						}}
						onPlay={onResume}
						onPause={onPause}
					/>
				</View>
				<PlayViewControlBar
					playType={playType}
					score={score}
					time={time}
					paused={paused}
					disabled={playType == null || !readyToPlay}
					song={song.data}
					onEnd={onEnd}
					onPause={() => {
						setShouldPlay(false);
					}}
					onResume={() => {
						setShouldPlay(true);
					}}
				/>
			</SafeAreaView>
			{colorScheme === 'dark' && (
				<LinearGradient
					colors={['#101014', '#6075F9']}
					style={{
						width: '100%',
						height: '100%',
						position: 'absolute',
						zIndex: -2,
					}}
				/>
			)}
		</View>
	);
};

export default PlayView;
