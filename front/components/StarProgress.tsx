import * as React from 'react';
import { Progress } from 'native-base';
import { View, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scoreAtom } from './Play/PlayScore';
import { useAtom } from 'jotai';

export interface StarProgressProps {
	max: number;
	starSteps: number[];
	style?: StyleProp<ViewStyle>;
}

const StarProgress = (props: StarProgressProps) => {
	const [score] = useAtom(scoreAtom);
	return (
		<View
			style={[
				{
					position: 'relative',
					maxWidth: 600,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
				},
				props.style,
			]}
		>
			<Progress
				color={'#6075F9'}
				style={{
					flex: 1,
				}}
				value={score}
				max={props.max}
			/>
			{props.starSteps.map((step) => {
				return (
					<Ionicons
						key={step}
						name={step <= score ? 'star' : 'star-outline'}
						color={step <= score ? '#EBDA3C' : '#6075F9'}
						size={20}
						style={{
							position: 'absolute',
							left: `${(step / props.max) * 100}%`,
						}}
					/>
				);
			})}
		</View>
	);
};

export default StarProgress;
