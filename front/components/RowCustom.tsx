import { useColorScheme } from 'react-native';
import { RootState, useSelector } from '../state/Store';
import { Box, Pressable } from 'native-base';

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

const RowCustom = (props: Parameters<typeof Box>[0] & { onPress?: () => void }) => {
	const settings = useSelector((state: RootState) => state.settings.local);
	const systemColorMode = useColorScheme();
	const colorScheme = settings.colorScheme;

	return (
		<Pressable onPress={props.onPress}>
			{({ isHovered, isPressed }) => (
				<Box
					{...props}
					py={3}
					my={1}
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

export default RowCustom;
