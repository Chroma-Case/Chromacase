import * as React from 'react';
import { View } from 'react-native';
import API from '../../API';
import { useQuery } from '../../Queries';
import Animated, { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { CursorInfoItem } from '../../models/SongCursorInfos';
import { PianoNotes } from '../../state/SoundPlayerSlice';
import { Audio } from 'expo-av';
import { SvgContainer } from './SvgContainer';
import LoadingComponent from '../Loading';

// note we are also using timestamp in a context
export type ParitionMagicProps = {
	timestamp: number;
	songID: number;
	onEndReached: () => void;
	onError?: (err: string) => void;
	onReady?: () => void;
};

const getSVGURL = (songID: number) => {
	return API.getPartitionSvgUrl(songID);
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
		}
	}
};

const PartitionMagic = ({
	timestamp,
	songID,
	onEndReached,
	onError,
	onReady,
}: ParitionMagicProps) => {
	const { data, isLoading, isError } = useQuery(API.getSongCursorInfos(songID));
	const currentCurIdx = React.useRef(-1);
	const [endPartitionReached, setEndPartitionReached] = React.useState(false);
	const [isPartitionSvgLoaded, setIsPartitionSvgLoaded] = React.useState(false);
	const partitionOffset = useSharedValue(0);
	const pianoSounds = React.useRef<Record<string, Audio.Sound> | null>(null);
	const cursorPaddingVertical = 10;
	const cursorPaddingHorizontal = 3;

	const cursorDisplayIdx = currentCurIdx.current === -1 ? 0 : currentCurIdx.current;

	const cursorBorderWidth = (data?.cursors[cursorDisplayIdx]?.width ?? 0) / 6;
	const cursorWidth = (data?.cursors[cursorDisplayIdx]?.width ?? 0) + cursorPaddingHorizontal * 2;
	const cursorHeight = (data?.cursors[cursorDisplayIdx]?.height ?? 0) + cursorPaddingVertical * 2;
	const cursorTop = (data?.cursors[cursorDisplayIdx]?.y ?? 0) - cursorPaddingVertical;
	const cursorLeft = (data?.cursors[0]?.x ?? 0) - cursorPaddingHorizontal;

	if (!endPartitionReached && currentCurIdx.current + 1 === data?.cursors.length) {
		// weird contraption but the mobile don't want classic functions to be called
		// with the withTiming function :(
		setEndPartitionReached(true);
	}

	React.useEffect(() => {
		if (!pianoSounds.current) {
			Promise.all(
				Object.entries(PianoNotes).map(async ([midiNumber, noteResource]) => {
					const { sound: s } = await Audio.Sound.createAsync(noteResource, {
						progressUpdateIntervalMillis: 500,
					});
					// const truc = await s.setProgressUpdateIntervalAsync(50);
					// console.warn(truc);
					return [midiNumber, s] as const;
				})
			).then((sounds) => {
				pianoSounds.current = Object.fromEntries(sounds);
				console.log('piano sounds loaded');
			});
		}
		const freeSounds = () => {
			if (pianoSounds.current) {
				Object.values(pianoSounds.current).forEach((s) => {
					s.unloadAsync();
				});
			}
		};
		return freeSounds;
	}, []);
	const partitionDims = React.useMemo<[number, number]>(() => {
		return [data?.pageWidth ?? 0, data?.pageHeight ?? 1];
	}, [data]);

	React.useEffect(() => {
		if (onError && isError) {
			onError('Error while loading partition');
			return;
		}
	}, [onError, isError]);

	React.useEffect(() => {
		if (onReady && isPartitionSvgLoaded && !isLoading) {
			onReady();
		}
	}, [onReady, isPartitionSvgLoaded, isLoading]);

	React.useEffect(() => {
		if (endPartitionReached) {
			onEndReached();
		}
	}, [endPartitionReached]);

	const transitionDuration = 200;

	getCursorToPlay(
		data?.cursors ?? [],
		currentCurIdx.current,
		timestamp - transitionDuration,
		(cursor, idx) => {
			currentCurIdx.current = idx;
			if (pianoSounds.current) {
				cursor.notes.forEach(({ note, duration }) => {
					try {
						const sound = pianoSounds.current![note]!;
						sound
							.playAsync()
							.then((t) => {
								console.log('ts', timestamp, 'dur', duration, 'infos', note, t);
							})
							.catch(console.error);
						console.log('playing note', note);
						setTimeout(() => {
							sound.stopAsync();
						}, duration - 10);
					} catch (e) {
						console.log(e);
					}
				});
			}
			partitionOffset.value = withTiming(
				-(cursor.x - data!.cursors[0]!.x) / partitionDims[0],
				{
					duration: transitionDuration,
					easing: Easing.inOut(Easing.ease),
				}
			);
		}
	);

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
						url={getSVGURL(songID)}
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
