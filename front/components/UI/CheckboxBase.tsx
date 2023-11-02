import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import InteractiveBase from './InteractiveBase';
import { useTheme, Text } from 'native-base';
import { AddSquare, TickSquare } from 'iconsax-react-native';

interface CheckboxProps {
	title: string;
	color?: string;
	check: boolean;
	setCheck: (value: boolean) => void;
	style?: StyleProp<ViewStyle>;
}

const CheckboxBase: React.FC<CheckboxProps> = ({ title, color, style, check, setCheck }) => {
	const { colors } = useTheme();

	return (
		<InteractiveBase
			style={[styles.container, style]}
			styleAnimate={{
				Default: {
					scale: 1,
					shadowOpacity: 0.3,
					shadowRadius: 4.65,
					elevation: 8,
					backgroundColor: colors.coolGray[500],
				},
				onHover: {
					scale: 1.01,
					shadowOpacity: 0.37,
					shadowRadius: 7.49,
					elevation: 12,
					backgroundColor: colors.coolGray[400],
				},
				onPressed: {
					scale: 0.99,
					shadowOpacity: 0.23,
					shadowRadius: 2.62,
					elevation: 4,
					backgroundColor: colors.coolGray[600],
				},
				Disabled: {
					scale: 1,
					shadowOpacity: 0.3,
					shadowRadius: 4.65,
					elevation: 8,
					backgroundColor: colors.coolGray[500],
				},
			}}
			onPress={async () => {
				setCheck(!check);
			}}
		>
			<View style={styles.content}>
				{check ? (
					<TickSquare size="24" color={color ?? colors.primary[300]} variant="Bold" />
				) : (
					<AddSquare size="24" color={color ?? colors.primary[300]} variant="Outline" />
				)}
				<Text style={styles.text} selectable={false}>
					{title}
				</Text>
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
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	text: {
		paddingLeft: 10,
	},
});

export default CheckboxBase;
