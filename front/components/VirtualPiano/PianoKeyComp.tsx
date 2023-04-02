import { Box, Pressable, Text } from "native-base";
import { StyleProp, ViewStyle } from "react-native";
import {
	PianoKey,
	NoteNameBehavior,
	octaveKeys,
	keyToStr,
} from "../../models/Piano";

type PianoKeyProps = {
	pianoKey: PianoKey;
	showNoteName: NoteNameBehavior;
	bg: string;
	bgPressed: string;
	bgHovered: string;
	onKeyDown: () => void;
	onKeyUp: () => void;
	text: Parameters<typeof Text>[0];
	style: StyleProp<ViewStyle>;
};

const isNoteVisible = (
	noteNameBehavior: NoteNameBehavior,
	isPressed: boolean,
	isHovered: boolean
) => {
	if (noteNameBehavior === NoteNameBehavior.always) return true;
	if (noteNameBehavior === NoteNameBehavior.never) return false;

	if (noteNameBehavior === NoteNameBehavior.onpress) {
		return isPressed;
	} else if (noteNameBehavior === NoteNameBehavior.onhover) {
		return isHovered;
	}
	return false;
};

const PianoKeyComp = ({
	pianoKey,
	showNoteName,
	bg,
	bgPressed,
	bgHovered,
	onKeyDown,
	onKeyUp,
	text,
	style,
}: PianoKeyProps) => {
	const textDefaultProps = {
		style: {
			userSelect: "none",
			WebkitUserSelect: "none",
			MozUserSelect: "none",
			msUserSelect: "none",
		},
		fontSize: "xl",
		color: "black",
	} as Parameters<typeof Text>[0];

	const textProps = { ...textDefaultProps, ...text };
	return (
		<Pressable
			onPressIn={onKeyDown}
			onPressOut={onKeyUp}
			style={style}
		>
			{({ isHovered, isPressed }) => (
				<Box
					bg={(() => {
						if (isPressed) return bgPressed;
						if (isHovered) return bgHovered;
						return bg;
					})()}
					w="100%"
					h="100%"
					borderWidth="1px"
					borderColor="black"
					justifyContent="flex-end"
					alignItems="center"
				>
					{isNoteVisible(showNoteName, isPressed, isHovered) && (
						<Text {...textProps}>{keyToStr(pianoKey, false)}</Text>
					)}
				</Box>
			)}
		</Pressable>
	);
};

PianoKeyComp.defaultProps = {
	key: octaveKeys[0],
	showNoteNames: NoteNameBehavior.onhover,
	keyBg: "white",
	keyBgPressed: "gray.200",
	keyBgHovered: "gray.100",
	onKeyDown: () => {},
	onKeyUp: () => {},
	text: {},
	style: {},
};

export default PianoKeyComp;
