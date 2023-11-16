import { BlurView } from 'expo-blur';
import { ReactNode } from 'react';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import useColorScheme from '../../hooks/colorScheme';

type GlassmorphismCCProps = {
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
};

const GlassmorphismCC = ({ children, style }: GlassmorphismCCProps) => {
	const colorScheme = useColorScheme();

	return (
		<BlurView
			style={[{ borderRadius: 12 }, style]}
			intensity={60}
			tint={colorScheme}
		>
			{children}
		</BlurView>
	);
};

export default GlassmorphismCC;
