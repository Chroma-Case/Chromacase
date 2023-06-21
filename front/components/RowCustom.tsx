import { useColorScheme } from "react-native";
import { RootState, useSelector } from "../state/Store";
import { Box, Pressable } from "native-base";

const RowCustom = (
	props: Parameters<typeof Box>[0] & { onPress?: () => void }
) => {
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
					bg={
						(colorScheme == "system" ? systemColorMode : colorScheme) == "dark"
							? isHovered || isPressed
								? "gray.800"
								: undefined
							: isHovered || isPressed
								? "coolGray.200"
								: undefined
					}
				>
					{props.children}
				</Box>
			)}
		</Pressable>
	);
};

export default RowCustom;