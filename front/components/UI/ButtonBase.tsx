import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, View, Image, StyleProp, ViewStyle } from 'react-native';
import InteractiveBase from './InteractiveBase';
import { Text, useTheme } from 'native-base';
import { Icon } from 'iconsax-react-native';
import useColorScheme from '../../hooks/colorScheme';

export type ButtonType = 'filled' | 'outlined' | 'menu';

interface ButtonProps {
	title?: string;
	style?: StyleProp<ViewStyle>;
	onPress?: () => void | Promise<void>;
	onLongPress?: () => void | Promise<void>;
	isDisabled?: boolean;
	icon?: Icon;
	iconVariant?: 'Bold' | 'Outline';
	iconImage?: string;
	type?: ButtonType;
}

const ButtonBase: React.FC<ButtonProps> = ({
	title,
	style,
	onPress,
	onLongPress,
	isDisabled,
	icon,
	iconImage,
	type = 'filled',
	iconVariant = 'Outline',
}) => {
	const { colors } = useTheme();
	const [loading, setLoading] = useState(false);
	const colorScheme = useColorScheme();

	const getColor = (colorScheme: 'light' | 'dark', type: ButtonType) => {
		if (type === 'outlined') {
			return colors.primary[300];
		}
		if (colorScheme === 'dark' || type === 'filled') {
			return '#FFFFFF';
		}
		return colors.black[500];
	};

	const styleButton = StyleSheet.create({
		Default: {
			scale: 1,
			shadowOpacity: 0.3,
			shadowRadius: 4.65,
			elevation: 8,
			backgroundColor: colors.primary[300],
		},
		onHover: {
			scale: 1.02,
			shadowOpacity: 0.37,
			shadowRadius: 7.49,
			elevation: 12,
			backgroundColor: colors.primary[400],
		},
		onPressed: {
			scale: 0.98,
			shadowOpacity: 0.23,
			shadowRadius: 2.62,
			elevation: 4,
			backgroundColor: colors.primary[500],
		},
		Disabled: {
			scale: 1,
			shadowOpacity: 0.3,
			shadowRadius: 4.65,
			elevation: 8,
			backgroundColor: colors.primary[300],
		},
	});

	const styleMenu = StyleSheet.create({
		Default: {
			scale: 1,
			shadowOpacity: 0,
			shadowRadius: 0,
			elevation: 0,
			backgroundColor: 'transparent',
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
	});

	const typeToStyleAnimator = { filled: styleButton, outlined: styleButton, menu: styleMenu };
	const MyIcon = icon;

	return (
		<InteractiveBase
			style={[styles.container, style]}
			styleAnimate={typeToStyleAnimator[type]}
			onPress={async () => {
				if (onPress && !isDisabled) {
					setLoading(true);
					try {
						await onPress();
					} catch (error) {
						console.error(error);
					} finally {
						setLoading(false);
					}
				}
			}}
			onLongPress={async () => {
				if (onLongPress && !isDisabled) {
					setLoading(true);
					try {
						await onLongPress();
					} catch (error) {
						console.error(error);
					} finally {
						setLoading(false);
					}
				}
			}}
			isDisabled={isDisabled}
			isOutlined={type === 'outlined'}
		>
			{loading ? (
				<ActivityIndicator
					style={styles.content}
					size="small"
					color={type === 'outlined' ? colors.primary[300] : '#FFFFFF'}
				/>
			) : (
				<View
					style={[
						styles.content,
						type === 'menu' ? { justifyContent: 'flex-start' } : {},
					]}
				>
					{MyIcon && (
						<MyIcon
							size={'18'}
							color={getColor(colorScheme, type)}
							variant={iconVariant}
						/>
					)}
					{iconImage && <Image source={{ uri: iconImage }} style={styles.icon} />}
					{title && (
						<Text style={[styles.text, type === 'filled' ? { color: '#fff' } : {}]}>
							{title}
						</Text>
					)}
				</View>
			)}
		</InteractiveBase>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 8,
	},
	content: {
		padding: 10,
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		width: 18,
		height: 18,
	},
	text: {
		userSelect: 'none',
		marginHorizontal: 8,
	},
});

export default ButtonBase;
