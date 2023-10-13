import * as React from 'react';
import { View, ImageBackground, Platform } from 'react-native';
import API from '../../API';
import { useQuery } from '../../Queries';
import { SvgCssUri } from 'react-native-svg';
import { PianoCC } from '../../views/PlayView';
import Animated, { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { CursorInfoItem } from '../../models/SongCursorInfos';

// note we are also using timestamp in a context
export type ParitionMagicProps = {
	songID: number;
	paused: boolean;
	onEndReached: () => void;
	onError: (err: string) => void;
	onReady: () => void;
};

const getSVGURL = (songID: number) => {
	return 'https://cdn.discordapp.com/attachments/717080637038788731/1161704545785757816/4.svg?ex=653944ab&is=6526cfab&hm=2416ee2cb414cc42fa9de8af58b8db544479d35f13393d76f02e8d9fe27aff45&';
};

const SVGContainer = ({
	songID,
	onReady,
	w,
	h,
}: {
	songID: number;
	onReady: () => void;
	w: number;
	h: number;
}) => {
	if (Platform.OS === 'web') {
		return (
			<img
				src={getSVGURL(songID)}
				onLoad={(e) => onReady()}
				style={{
					height: '100%',
					// aspectRatio: w / h,
				}}
			/>
		);
	} else {
		return <SvgCssUri uri={getSVGURL(songID)} />;
	}
};

const getCursorToPlay = (
	cursorInfos: CursorInfoItem[],
	currentCurIdx: number,
	timestamp: number,
	onCursorMove: (cursor: CursorInfoItem, idx: number) => void
) => {
	for (let i = cursorInfos.length - 1; i > currentCurIdx; i--) {
		const cursorInfo = cursorInfos[i]!;
		if (cursorInfo.timestamp <= timestamp) {
			onCursorMove(cursorInfo, i);
		}
	}
};

const PartitionMagic = ({ songID, paused, onEndReached, onError, onReady }: ParitionMagicProps) => {
	const { data, isLoading, isError } = useQuery(API.getSongCursorInfos(songID));
	const [currentCurIdx, setCurrentCurIdx] = React.useState(0);
	const partitionOffset = useSharedValue(0);
	const pianoCC = React.useContext(PianoCC);
	const partitionWidth = 16573;
	const partitionHeight = 402;

	const cursorPaddingVertical = 10;
	const cursorPaddingHorizontal = 3;

	const cursorBorderWidth = (data?.cursors[currentCurIdx]?.width ?? 0) / 6;
	const cursorWidth = (data?.cursors[currentCurIdx]?.width ?? 0) + cursorPaddingHorizontal * 2;
	const cursorHeight = (data?.cursors[currentCurIdx]?.height ?? 0) + cursorPaddingVertical * 2;
	const cursorTop = (data?.cursors[currentCurIdx]?.y ?? 0) - cursorPaddingVertical;
	const cursorLeft = (data?.cursors[0]?.x ?? 0) - cursorPaddingHorizontal;

	getCursorToPlay(data?.cursors ?? [], currentCurIdx, pianoCC.timestamp, (cursor, idx) => {
		partitionOffset.value = withTiming(-(cursor.x - data!.cursors[0]!.x) / partitionWidth, {
			duration: 75,
			easing: Easing.inOut(Easing.ease),
		});
		setCurrentCurIdx(idx);
	});

	return (
		<>
			<View
				style={{
					flex: 1,
					alignItems: 'flex-start',
					position: 'relative',
				}}
			>
				<View
					style={{
						position: 'absolute',
						aspectRatio: partitionWidth / partitionHeight,
						height: '100%',
					}}
				>
					<Animated.View
						style={{
							position: 'absolute',
							height: '100%',
							aspectRatio: partitionWidth / partitionHeight,
							left: `${partitionOffset.value * 100}%`,
						}}
					>
						<ImageBackground
							source={{ uri: getSVGURL(songID) }}
							onLoad={onReady}
							style={{
								aspectRatio: partitionWidth / partitionHeight,
								height: '100%',
								position: 'relative',
							}}
						/>
					</Animated.View>
					<Animated.View
						style={{
							position: 'absolute',
							left: `${(cursorLeft / partitionWidth) * 100}%`,
							top: `${(cursorTop / partitionHeight) * 100}%`,
							backgroundColor: 'rgba(96, 117, 249, 0.33)',
							width: `${(cursorWidth / partitionWidth) * 100}%`,
							height: `${(cursorHeight / partitionHeight) * 100}%`,
							borderWidth: cursorBorderWidth,
							borderColor: '#101014',
							borderStyle: 'solid',
							borderRadius: cursorBorderWidth * 2,
						}}
					/>
				</View>
			</View>
		</>
	);
};

export default PartitionMagic;
