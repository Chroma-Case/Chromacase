import React from 'react';
import { StyleSheet, View } from 'react-native';
import InteractiveBase from './InteractiveBase';
import { Text, useTheme } from 'native-base';

interface SettingProps {
	icon: (size: number, color: string) => React.ReactNode;
	title: string;
	description?: string;
	onPress?: () => Promise<void>;
	children?: React.ReactNode;
}

const SettingBase: React.FC<SettingProps> = ({ title, description, onPress, icon, children }) => {
	const { colors } = useTheme();
	const styleSetting = StyleSheet.create({
		Default: {
			scale: 1,
			shadowOpacity: 0.3,
			shadowRadius: 4.65,
			elevation: 8,
			backgroundColor: colors.coolGray[500],
		},
		onHover: {
			scale: 1,
			shadowOpacity: 0.3,
			shadowRadius: 4.65,
			elevation: 8,
			backgroundColor: colors.coolGray[700],
		},
		onPressed: {
			scale: 1,
			shadowOpacity: 0.3,
			shadowRadius: 4.65,
			elevation: 8,
			backgroundColor: colors.coolGray[500],
		},
		Disabled: {
			scale: 1,
			shadowOpacity: 0.3,
			shadowRadius: 4.65,
			elevation: 8,
			backgroundColor: colors.coolGray[500],
		},
	});

	return (
		<InteractiveBase
			style={[styles.container, { backgroundColor: colors.coolGray[500] }]}
			styleAnimate={styleSetting}
			onPress={async () => {
				if (onPress) {
					await onPress();
				}
			}}
		>
			<View style={styles.content}>
				{icon(24, '#fff')}
				<View style={styles.info}>
					<Text style={styles.text}>{title}</Text>
					<Text style={styles.description}>{description}</Text>
				</View>
				{children}
			</View>
		</InteractiveBase>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		borderRadius: 8,
	},
	content: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'stretch',
		flexDirection: 'row',
	},
	info: {
		flexDirection: 'column',
		marginHorizontal: 16,
		flex: 1,
	},
	text: {
		color: '#fff',
		fontSize: 16,
	},
	description: {
		color: '#fff',
		fontSize: 10,
	},
});

export default SettingBase;
