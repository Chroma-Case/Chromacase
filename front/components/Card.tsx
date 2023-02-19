import { useTheme, Box, Pressable } from 'native-base';
import React from 'react';
import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { SettingsState } from '../state/SettingsSlice';
import { RootState } from '../state/Store';

export const CardBorderRadius = 10;

const cardBorder = (theme: ReturnType<typeof useTheme>) => ({
	borderColor: theme.colors.text[100],
	borderRadius: CardBorderRadius,
	borderWidth: 1 
})

const Card = (props: Parameters<typeof Box>[0] & { onPress: () => void }) => {
	const theme = useTheme();
	const colorScheme: SettingsState['colorScheme'] = useSelector((state: RootState) => state.settings.settings.colorScheme);
	const systemColorMode = useColorScheme();

	return <Pressable onPress={props.onPress}>
		{({ isHovered, isPressed }) => (
		<Box {...props} style={{ ...(props.style ?? {}),  ...cardBorder(theme) }}
			bg={(colorScheme == 'system' ? systemColorMode : colorScheme) == 'dark'
				? (isHovered || isPressed) ? 'gray.800' : undefined
				: (isHovered || isPressed) ? 'coolGray.200' : undefined
			}
		>
			{ props.children }
		</Box>
		)}
	</Pressable>
	
}

export default Card;