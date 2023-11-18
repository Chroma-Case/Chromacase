import { useTheme, Box, Pressable } from 'native-base';
import React from 'react';
import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../state/Store';

export const CardBorderRadius = 10;

const cardBorder = (theme: ReturnType<typeof useTheme>) => ({
	borderColor: theme.colors.text[100],
	borderRadius: CardBorderRadius,
	borderWidth: 1,
});

type CardProps = Parameters<typeof Box>[0] & {
	onPress: () => void;
};

const getBgColor = (isPressed: boolean, isHovered: boolean, colorScheme: 'light' | 'dark') => {
	if (colorScheme === 'dark') {
		if (isPressed) {
			return 'gray.800';
		}
		if (isHovered) {
			return 'gray.700';
		}
		return undefined;
	}
	if (isPressed) {
		return 'coolGray.200';
	}
	if (isHovered) {
		return 'coolGray.100';
	}
	return undefined;
};

const Card = (props: CardProps) => {
	const theme = useTheme();
	const colorScheme = useSelector((state: RootState) => state.settings.local.colorScheme);
	const systemColorMode = useColorScheme();

	return (
		<Pressable onPress={props.onPress}>
			{({ isHovered, isPressed }) => (
				<Box
					{...props}
					style={[props.style, cardBorder(theme)]}
					bg={getBgColor(
						isPressed,
						isHovered,
						(colorScheme === 'system' ? systemColorMode : colorScheme) ?? 'light'
					)}
				>
					{props.children}
				</Box>
			)}
		</Pressable>
	);
};

export default Card;
