import * as React from 'react';
import { Platform, View } from 'react-native';
import API from '../../API';
import { useQuery } from '../../Queries';
import Animated, { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { CursorInfoItem } from '../../models/SongCursorInfos';
import { Audio } from 'expo-av';
import { SvgContainer } from './SvgContainer';
import LoadingComponent from '../Loading';
import { SplendidGrandPiano } from 'smplr';
import { atom, useAtom } from 'jotai';
import { useStopwatch } from 'react-use-precision-timer';

export const timestampAtom = atom(0);
export const shouldPlayAtom = atom(false);
export const partitionStateAtom = atom(
	'loading' as 'loading' | 'ready' | 'playing' | 'paused' | 'ended' | 'error'
);

export type ParitionMagicProps = {
	songID: number;
};

const getCursorToPlay = (
	cursorInfos: CursorInfoItem[],
	currentCurIdx: number,
	timestamp: number,
	onCursorMove: (cursor: CursorInfoItem, idx: number) => void
) => {
	if (timestamp <= 0) {
		return;
	}
	for (let i = cursorInfos.length - 1; i > currentCurIdx; i--) {
		const cursorInfo = cursorInfos[i]!;
		if (cursorInfo.timestamp <= timestamp) {
			onCursorMove(cursorInfo, i);
			return;
		}
	}
};

const startResumePauseWatch = (stopwatch: ReturnType<typeof useStopwatch>, shouldPlay: boolean) => {
	if (shouldPlay) {
		if (stopwatch.isPaused()) {
			stopwatch.resume();
			return;
		}
		stopwatch.start();
		return;
	}
	stopwatch.pause();
};

const transitionDuration = 200;

const PartitionMagic = ({ songID }: ParitionMagicProps) => {
	const { data, isLoading, isError } = useQuery(API.getSongCursorInfos(songID));
	const currentCurIdx = React.useRef(-1);
	const stopwatch = useStopwatch();
	const [endPartitionReached, setEndPartitionReached] = React.useState(false);
	const [isPartitionSvgLoaded, setIsPartitionSvgLoaded] = React.useState(false);
	const partitionOffset = useSharedValue(0);
	const melodySound = React.useRef<Audio.Sound | null>(null);
	const piano = React.useRef<SplendidGrandPiano | null>(null);
	const [isPianoLoaded, setIsPianoLoaded] = React.useState(false);
	const [timestamp, setTimestamp] = useAtom(timestampAtom);
	const [shouldPlay, setShouldPlay] = useAtom(shouldPlayAtom);
	const [partitionState, setPartitionState] = useAtom(partitionStateAtom);
	const cursorPaddingVertical = 10;
	const cursorPaddingHorizontal = 3;

	const cursorDisplayIdx = currentCurIdx.current === -1 ? 0 : currentCurIdx.current;

	const cursorBorderWidth = (data?.cursors[cursorDisplayIdx]?.width ?? 0) / 6;
	const cursorWidth = (data?.cursors[cursorDisplayIdx]?.width ?? 0) + cursorPaddingHorizontal * 2;
	const cursorHeight = (data?.cursors[cursorDisplayIdx]?.height ?? 0) + cursorPaddingVertical * 2;
	const cursorTop = (data?.cursors[cursorDisplayIdx]?.y ?? 0) - cursorPaddingVertical;
	const cursorLeft = (data?.cursors[0]?.x ?? 0) - cursorPaddingHorizontal;

	console.log('state', partitionState, timestamp);

	if (!endPartitionReached && currentCurIdx.current + 1 === data?.cursors.length) {
		// weird contraption but the mobile don't want classic functions to be called
		// with the withTiming function :(
		melodySound.current?.pauseAsync();
		piano.current?.stop();
		setPartitionState('ended');
	}

	React.useEffect(() => {
		if (isError) {
			setPartitionState('error');
		}
	}, [isError]);

	React.useEffect(() => {
		if (isPartitionSvgLoaded && !isLoading && (melodySound.current?._loaded || isPianoLoaded)) {
			setPartitionState('ready');
		} else if (partitionState !== 'loading') {
			setPartitionState('loading');
		}

		return () => {
			setPartitionState('loading');
			setTimestamp(0);
			setShouldPlay(false);
		};
	}, [isPartitionSvgLoaded, isLoading, melodySound.current?._loaded, isPianoLoaded]);

	React.useEffect(() => {
		if (Platform.OS === 'web' && !piano.current) {
			const audio = new AudioContext();
			piano.current = new SplendidGrandPiano(audio);
			piano.current.load.then(() => {
				setIsPianoLoaded(true);
			});
		} else if (!melodySound.current) {
			Audio.Sound.createAsync({
				uri: API.getPartitionMelodyUrl(songID),
			}).then((track) => {
				melodySound.current = track.sound;
			});
		}
		return () => {
			if (melodySound.current) {
				melodySound.current.pauseAsync();
				melodySound.current.unloadAsync();
				melodySound.current = null;
			}
			if (piano.current) {
				piano.current.stop();
				piano.current.context.close();
				piano.current = null;
			}
		};
	}, []);
	const partitionDims = React.useMemo<[number, number]>(() => {
		return [data?.pageWidth ?? 0, data?.pageHeight ?? 1];
	}, [data]);

	React.useEffect(() => {
		const interval = setInterval(
			() => {
				// if (partitionState !== 'playing') return;
				setTimestamp(stopwatch.getElapsedRunningTime());
			},
			Platform.OS === 'web' ? 200 : 500
		);
		return () => {
			clearInterval(interval);
		};
	}, []);

	React.useEffect(() => {
		if (Platform.OS === 'web') {
			if (!piano.current || !isPianoLoaded) return;
			setPartitionState(shouldPlay ? 'playing' : 'paused');
			startResumePauseWatch(stopwatch, shouldPlay);
			return;
		}
		if (!melodySound.current || !melodySound.current._loaded) return;
		setPartitionState(shouldPlay ? 'playing' : 'paused');
		startResumePauseWatch(stopwatch, shouldPlay);
		if (shouldPlay) {
			melodySound.current.playAsync().catch(console.error);
		} else {
			melodySound.current.pauseAsync().catch(console.error);
		}
	}, [shouldPlay]);

	React.useEffect(() => {
		if (!shouldPlay) return;
		if (!melodySound.current || !melodySound.current._loaded) return;
		if (!data || data?.cursors.length === 0) return;
		getCursorToPlay(
			data!.cursors,
			currentCurIdx.current,
			timestamp + transitionDuration,
			(cursor, idx) => {
				currentCurIdx.current = idx;
				partitionOffset.value = withTiming(
					-(cursor.x - data!.cursors[0]!.x) / partitionDims[0],
					{
						duration: transitionDuration,
						easing: Easing.inOut(Easing.ease),
					}
				);
				if (!piano.current || !isPianoLoaded) return;
				cursor.notes.forEach((note) => {
					piano.current?.start({
						note: note.note,
						duration: note.duration,
					});
				});
			}
		);
	}, [timestamp, data?.cursors, isPianoLoaded]);

	return (
		<View
			style={{
				flex: 1,
				alignItems: 'flex-start',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{(!isPartitionSvgLoaded || isLoading) && (
				<View
					style={{
						position: 'absolute',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '100%',
						height: '100%',
						zIndex: 50,
						backgroundColor: 'rgba(0,0,0,0.5)',
					}}
				>
					<LoadingComponent />
				</View>
			)}
			<View
				style={{
					position: 'absolute',
					aspectRatio: partitionDims[0] / partitionDims[1],
					height: '100%',
				}}
			>
				<Animated.View
					style={{
						position: 'absolute',
						height: '100%',
						aspectRatio: partitionDims[0] / partitionDims[1],
						left: `${partitionOffset.value * 100}%`,
						display: 'flex',
						alignItems: 'stretch',
						justifyContent: 'flex-start',
					}}
				>
					<SvgContainer
						url={API.getPartitionSvgUrl(songID)}
						onReady={() => {
							setIsPartitionSvgLoaded(true);
						}}
						style={{
							aspectRatio: partitionDims[0] / partitionDims[1],
						}}
					/>
				</Animated.View>
				<Animated.View
					style={{
						position: 'absolute',
						left: `${(cursorLeft / partitionDims[0]) * 100}%`,
						top: `${(cursorTop / partitionDims[1]) * 100}%`,
						backgroundColor: 'rgba(96, 117, 249, 0.33)',
						width: `${(cursorWidth / partitionDims[0]) * 100}%`,
						height: `${(cursorHeight / partitionDims[1]) * 100}%`,
						borderWidth: cursorBorderWidth,
						borderColor: '#101014',
						borderStyle: 'solid',
						borderRadius: cursorBorderWidth * 2,
					}}
				/>
			</View>
		</View>
	);
};

export default PartitionMagic;
