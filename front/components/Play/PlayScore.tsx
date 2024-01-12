import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'native-base';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSequence,
	withTiming,
	withDelay,
	Easing,
} from 'react-native-reanimated';
import { ColorSchemeType } from 'native-base/lib/typescript/components/types';

export type ScoreMessage = {
	content: string;
	color?: ColorSchemeType;
	id: number;
};

type PlayScoreProps = {
	score: number;
	streak: number;
	message?: ScoreMessage;
};

export const PlayScore = ({ score, streak, message }: PlayScoreProps) => {
	const scoreMessageScale = useSharedValue(0);
	// this style should bounce in on enter and fade away
	const scoreMsgStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scoreMessageScale.value }],
		};
	});
	const { colors } = useTheme();
	const textColor = colors.text;

	useEffect(() => {
		if (message) {
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
	}, [message]);

	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				gap: 3,
			}}
		>
			<View
				style={{
					backgroundColor: 'rgba(16, 16, 20, 0.8)',
					paddingHorizontal: 20,
					paddingVertical: 5,
					borderRadius: 12,
				}}
			>
				<Text color={textColor[900]} fontSize={24}>
					{score}
				</Text>
			</View>
			{message && (
				<Animated.View style={[scoreMsgStyle]}>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 7,
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: 'rgba(16, 16, 20, 0.8)',
							paddingHorizontal: 20,
							paddingVertical: 5,
							borderRadius: 12,
						}}
					>
						<Text color={textColor[900]} fontSize={20}>
							{message.content}
						</Text>
						{streak > 0 && (
							<Text color={textColor[900]} fontSize={15} bold>
								{`x${streak}`}
							</Text>
						)}
					</View>
				</Animated.View>
			)}
		</View>
	);
};
