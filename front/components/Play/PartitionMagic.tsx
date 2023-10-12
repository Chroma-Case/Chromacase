import * as React from 'react';
import { ActivityIndicator, View, ImageBackground, Platform } from 'react-native';
import API from '../../API';
import { useQuery } from '../../Queries';
import { SvgCssUri } from 'react-native-svg';
import { PianoCC } from '../../views/PlayView';
import { Button } from 'native-base';
import Animated, { useSharedValue, withTiming, withSpring, Easing } from 'react-native-reanimated';
import { CursorInfoItem, SongCursorInfos } from '../../models/SongCursorInfos';

const myFindLast = <T,>(a: T[], p: (_: T, _2: number) => boolean) => {
	for (let i = a.length - 1; i >= 0; i--) {
		if (p(a[i]!, i)) {
			return a[i];
		}
	}
	return undefined;
};

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

const SVGContainer = ({ songID, onReady }: { songID: number; onReady: () => void }) => {
	if (Platform.OS === 'web') {
		return <img src={getSVGURL(songID)} onLoad={(e) => onReady()} />;
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
	const cursorPosition = useSharedValue(0);
	const pianoCC = React.useContext(PianoCC);
	const partitionWidth = 16573;
	const partitionHeight = 402;

	getCursorToPlay(data?.cursors ?? [], currentCurIdx, pianoCC.timestamp, (cursor, idx) => {
		partitionOffset.value = -cursor.x + data!.cursors[0]!.x;

		// cursorPosition.value = cursor.x;
		setCurrentCurIdx(idx);
		// 	duration: 75,
		// 	// easing: Easing.inOut(Easing.ease),
		// });
	});

	const handlePress = () => {
		partitionOffset.value = withSpring(partitionOffset.value - 50);
	};
	return (
		<>
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'flex-start',
					overflow: 'hidden',
					position: 'relative',
				}}
			>
				<Animated.View
					style={{
						position: 'absolute',
						height: '100%',
						left: partitionOffset,
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
					>
						<Animated.View
							style={{
								position: 'absolute',
								left: `${(data?.cursors[0]?.x ?? 0) / partitionWidth * 100}%`,
								top: `${(data?.cursors[0]?.y ?? 0) / partitionHeight * 100}%`,
								backgroundColor: 'rgba(96, 117, 249, 0.33)',
								width: `${30 / partitionWidth * 100}%`, // 46,
								height: `${144 / partitionHeight * 100}%`, // 160,
							}}
						/>
					</ImageBackground>
					{/* <SVGContainer songID={songID} onReady={onReady} /> */}
				</Animated.View>
				{/* <View
					style={{
						position: 'absolute',
						left: (data?.cursors[0]?.x ?? 0) - 5,
						top: data?.cursors[0]?.y ?? 0,
						backgroundColor: 'rgba(96, 117, 249, 0.33)',
						borderRadius: 20,
						borderWidth: 5,
						borderColor: '#101014',
						borderStyle: 'solid',
						paddingVertical: 16,
					}}
				> */}
				{/* </View> */}
			</View>
			<Button onPress={handlePress}>Move</Button>
		</>
	);
};

export default PartitionMagic;
