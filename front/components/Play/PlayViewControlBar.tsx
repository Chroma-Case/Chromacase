import { View } from 'react-native';
import * as React from 'react';
import { Row, Image, Text, useBreakpointValue, IconButton } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { MetronomeControls } from '../Metronome';
import StarProgress from '../StarProgress';
import Song from '../../models/Song';
import { useTheme } from 'native-base';

type PlayViewControlBarProps = {
	playType: 'practice' | 'normal' | null;
	song: Song;
	time: number;
	paused: boolean;
	score: number;
	disabled: boolean;
	onResume: () => void;
	onPause: () => void;
	onEnd: () => void;
};

const PlayViewControlBar = ({
	playType,
	song,
	time,
	paused,
	score,
	disabled,
	onResume,
	onPause,
	onEnd,
}: PlayViewControlBarProps) => {
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isPhone = screenSize === 'small';
	const bpm = React.useRef<number>(60);
	const { colors } = useTheme();
	const textColor = colors.text;
	return (
		<Row
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 5,
				borderRadius: 12,
				backgroundColor: 'rgba(16, 16, 20, 0.5)',
				//@ts-expect-error backdropFilter is not in the types
				backdropFilter: 'blur(2px)',
				padding: isPhone ? 5 : 10,
			}}
		>
			<View
				style={{
					flexGrow: 0,
					flexShrink: 3,
					justifyContent: 'center',
					alignItems: 'center',
					marginRight: isPhone ? undefined : 40,
					minWidth: 160,
				}}
			>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: isPhone ? 5 : 20,
						maxWidth: '100%',
					}}
				>
					<Image
						src={song.cover}
						alt="cover"
						size={isPhone ? '2sm' : 'sm'}
						borderRadius={8}
						style={{
							flexShrink: 0,
							aspectRatio: 1,
						}}
					/>
					<View
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							gap: 8,
							flexGrow: 1,
							flexShrink: 1,
						}}
					>
						<Text color={textColor[800]} fontSize={14} maxW={'100%'} isTruncated>
							{song.name}
						</Text>
						{song.artist && (
							<Text color={textColor[900]} fontSize={12} maxW={'100%'} isTruncated>
								{song.artist?.name}
							</Text>
						)}
					</View>
				</View>
			</View>
			<View
				style={{
					flexGrow: 1,
					flexShrink: 1,
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					gap: isPhone ? 10 : 25,
				}}
			>
				{ playType != 'practice' &&
				<IconButton
					size="sm"
					variant="solid"
					disabled={disabled}
					_icon={{
						as: Ionicons,
						color: colors.coolGray[900],
						name: paused ? 'play' : 'pause',
					}}
					onPress={paused ? onResume : onPause}
				/>}
				<IconButton
					size="sm"
					colorScheme="coolGray"
					variant="solid"
					_icon={{
						as: Ionicons,
						name: 'stop',
					}}
					onPress={onEnd}
				/>
				<Text color={textColor[900]}>
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
						minWidth: isPhone ? 50 : 200,
					}}
				/>
			</View>
			<View
				style={{
					flex: 1,
					justifyContent: 'space-evenly',
					alignItems: 'center',
					flexDirection: 'row',
					marginLeft: isPhone ? undefined : 40,
					maxWidth: 250,
					minWidth: 120,
				}}
			>
				{ playType != 'practice' &&
				<MetronomeControls paused={paused} bpm={bpm.current} />}
			</View>
		</Row>
	);
};

PlayViewControlBar.defaultProps = {
	onResume: () => {},
	onPause: () => {},
	onEnd: () => {},
	disabled: false,
};

export default PlayViewControlBar;
