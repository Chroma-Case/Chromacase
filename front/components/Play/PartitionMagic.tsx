import * as React from 'react';
import { View, ImageBackground, Platform, Image } from 'react-native';
import API from '../../API';
import { useQuery } from '../../Queries';
import { SvgCssUri } from 'react-native-svg';
import { PianoCC } from '../../views/PlayView';
import Animated, { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { CursorInfoItem } from '../../models/SongCursorInfos';

// note we are also using timestamp in a context
export type ParitionMagicProps = {
	songID: number;
	onEndReached: () => void;
	onError: (err: string) => void;
	onReady: () => void;
};

const getSVGURL = (songID: number) => {
	return API.getPartitionSvgUrl(songID);
	return 'https://cdn.discordapp.com/attachments/717080637038788731/1162519992722530354/Short.mxl_1.svg?ex=653c3c1c&is=6529c71c&hm=1788e4abe532f4a2af8c24cae6dadcfde369eaf58322f051ecd1d9110d8b699a&';
	// return 'https://cdn.discordapp.com/attachments/717080637038788731/1161704545785757816/4.svg?ex=653944ab&is=6526cfab&hm=2416ee2cb414cc42fa9de8af58b8db544479d35f13393d76f02e8d9fe27aff45&';
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
				onLoad={() => onReady()}
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

const PartitionMagic = ({ songID, onEndReached, onError, onReady }: ParitionMagicProps) => {
	const { data, isLoading, isError } = useQuery(API.getSongCursorInfos(songID));
	const [currentCurIdx, setCurrentCurIdx] = React.useState(0);
	const partitionOffset = useSharedValue(0);
	const [partitionDims, setPartitionDims] = React.useState<[number, number]>([0, 0]);
	const pianoCC = React.useContext(PianoCC);

	const cursorPaddingVertical = 10;
	const cursorPaddingHorizontal = 3;

	const cursorBorderWidth = (data?.cursors[currentCurIdx]?.width ?? 0) / 6;
	const cursorWidth = (data?.cursors[currentCurIdx]?.width ?? 0) + cursorPaddingHorizontal * 2;
	const cursorHeight = (data?.cursors[currentCurIdx]?.height ?? 0) + cursorPaddingVertical * 2;
	const cursorTop = (data?.cursors[currentCurIdx]?.y ?? 0) - cursorPaddingVertical;
	const cursorLeft = (data?.cursors[0]?.x ?? 0) - cursorPaddingHorizontal;

	React.useEffect(() => {
		Image.getSize(getSVGURL(songID), (w, h) => {
			setPartitionDims([w, h]);
		});
	}, []);

	React.useEffect(() => {
		if (isLoading) {
			return;
		}
		if (isError) {
			onError('Error while loading partition');
			return;
		}
	}, [isLoading, isError]);

	const transitionDuration = 200;

	getCursorToPlay(
		data?.cursors ?? [],
		currentCurIdx,
		pianoCC.timestamp - transitionDuration,
		(cursor, idx) => {
			partitionOffset.value = withTiming(
				-(cursor.x - data!.cursors[0]!.x) / partitionDims[0],
				{
					duration: transitionDuration,
					easing: Easing.inOut(Easing.ease),
				},
				() => {
					if (idx === data!.cursors.length - 1) {
						onEndReached();
					}
				}
			);
			setCurrentCurIdx(idx);
		}
	);

	return (
		<>
			<View
				style={{
					flex: 1,
					alignItems: 'flex-start',
					position: 'relative',
					overflow: 'hidden',
				}}
			>
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
						}}
					>
						{!isLoading && !isError && (
							<ImageBackground
								source={{ uri: getSVGURL(songID) }}
								onLoad={onReady}
								style={{
									aspectRatio: partitionDims[0] / partitionDims[1],
									height: '100%',
									position: 'relative',
								}}
							/>
						)}
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
		</>
	);
};

export default PartitionMagic;
