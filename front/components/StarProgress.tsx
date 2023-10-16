import * as React from 'react';
import { Progress } from 'native-base';
import { View, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface StarProgressProps {
	value: number;
	max: number;
	starSteps: number[];
	style?: StyleProp<ViewStyle>;
}

const StarProgress = (props: StarProgressProps) => {
	return (
		<View
			style={[
				props.style,
				{
					position: 'relative',
					flex: 1,
					maxWidth: 600,
					justifyContent: 'center',
				},
			]}
		>
			<Progress
				color={'#6075F9'}
				style={{
					position: 'absolute',
					width: '100%',
				}}
				value={props.value}
				max={props.max}
			/>
			{props.starSteps.map((step) => {
				return (
					<Ionicons
						key={step}
						name={step <= props.value ? 'star' : 'star-outline'}
						color={step <= props.value ? '#EBDA3C' : '#6075F9'}
						size={20}
						style={{
							position: 'absolute',
							left: `${(step / props.max) * 100}%`,
							top: '45%',
							transform: 'translate(-50%, -55%)',
						}}
					/>
				);
			})}
		</View>
	);
};

export default StarProgress;
