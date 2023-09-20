import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import InteractiveBase from './InteractiveBase';
import { Checkbox } from 'native-base';

interface CheckboxProps {
	title: string;
	value: string;
	// color: string;
	check: boolean;
	setCheck: (value: boolean) => void;
	style?: StyleProp<ViewStyle>;
}

const CheckboxBase: React.FC<CheckboxProps> = ({
	title,
	value,
	// color,
	style,
	check,
	setCheck,
}) => {
	const styleGlassmorphism = StyleSheet.create({
		Default: {
			scale: 1,
			shadowOpacity: 0.3,
			shadowRadius: 4.65,
			elevation: 8,
			backgroundColor: 'rgba(16,16,20,0.5)',
		},
		onHover: {
			scale: 1.01,
			shadowOpacity: 0.37,
			shadowRadius: 7.49,
			elevation: 12,
			backgroundColor: 'rgba(16,16,20,0.4)',
		},
		onPressed: {
			scale: 0.99,
			shadowOpacity: 0.23,
			shadowRadius: 2.62,
			elevation: 4,
			backgroundColor: 'rgba(16,16,20,0.6)',
		},
		Disabled: {
			scale: 1,
			shadowOpacity: 0.3,
			shadowRadius: 4.65,
			elevation: 8,
			backgroundColor: 'rgba(16,16,20,0.5)',
		},
	});

	return (
		<InteractiveBase
			style={[styles.container, style]}
			styleAnimate={styleGlassmorphism}
			onPress={async () => {
				setCheck(!check);
			}}
		>
			<View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
				<Checkbox isChecked={check} style={styles.content} value={value}>
					{title}
				</Checkbox>
			</View>
		</InteractiveBase>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 8,
	},
	content: {
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
	},
});

export default CheckboxBase;
