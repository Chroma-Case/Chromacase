import {
	Note,
	PianoKey,
	NoteNameBehavior,
	octaveKeys,
	Accidental,
} from "../../models/Piano";
import { Box, Row, Pressable, ZStack, Text } from "native-base";

const notesList: Array<Note> = ["C", "D", "E", "F", "G", "A", "B"];
const accidentalsList: Array<Accidental> = ["#", "b", "##", "bb"];

const getKeyIndex = (n: Note, keys: PianoKey[]) => {
	for (let i = 0; i < keys.length; i++) {
		if (keys[i]?.note === n) {
			return i;
		}
	}
	return -1;
};

const isNoteVisible = (
	showNoteNamesPolicy: NoteNameBehavior,
	isPressed: boolean,
	isHovered: boolean,
	isHighlighted: boolean
) => {
	if (showNoteNamesPolicy === "always") return true;
	if (showNoteNamesPolicy === "never") return false;

	if (showNoteNamesPolicy === "onpress") {
		return isPressed;
	} else if (showNoteNamesPolicy === "onhover") {
		return isHovered;
	} else if (showNoteNamesPolicy === "onhighlight") {
		return isHighlighted;
	}
	return false;
};

type OctaveProps = Parameters<typeof Box>[0] & {
	number: number;
	startNote: Note;
	endNote: Note;
	showNoteNames: NoteNameBehavior;
	onNoteDown: (note: PianoKey) => void;
	onNoteUp: (note: PianoKey) => void;
};

const Octave = (props: OctaveProps) => {
	const { number, startNote, endNote, showNoteNames, onNoteDown, onNoteUp } =
		props;
	const oK: PianoKey[] = octaveKeys.map((k) => {
		return new PianoKey(k.note, k.accidental, number);
	});

	const startNoteIndex = getKeyIndex(startNote, oK);
	const endNoteIndex = getKeyIndex(endNote, oK);
	const keys = oK.slice(startNoteIndex, endNoteIndex + 1);

	const whiteKeys = keys.filter((k) => k?.accidental === undefined);
	const blackKeys = keys.filter((k) => k?.accidental !== undefined);

	const whiteKeyWidthExpr = "calc(100% / 7)";
	const whiteKeyHeightExpr = "100%";
	const blackKeyWidthExpr = "calc(100% / 13)";
	const blackKeyHeightExpr = "calc(100% / 1.5)";

	return (
		<Box {...props}>
			<Row height={"100%"} width={"100%"}>
				{whiteKeys.map((key, i) => {
					return (
						<Pressable
							width={whiteKeyWidthExpr}
							height={whiteKeyHeightExpr}
							key={i}
							onPressIn={() => onNoteDown(key)}
							onPressOut={() => onNoteUp(key)}
						>
							{({ isHovered, isPressed }) => (
								<Box
									bg={
										isHovered ? (isPressed ? "gray.300" : "gray.100") : "white"
									}
									w="100%"
									h="100%"
									borderWidth="1px"
									borderColor="black"
									justifyContent="flex-end"
									alignItems="center"
								>
									{isNoteVisible(
										showNoteNames,
										isPressed,
										isHovered,
										false
									) && (
										<Text
											style={{
												userSelect: "none",
												WebkitUserSelect: "none",
												MozUserSelect: "none",
												msUserSelect: "none",
											}}
											fontSize="xl"
										>
											{key.note}
										</Text>
									)}
								</Box>
							)}
						</Pressable>
					);
				})}
				{blackKeys.map((key, i) => {
					return (
						<Pressable
							key={i}
							onPressIn={() => onNoteDown(key)}
							onPressOut={() => onNoteUp(key)}
							width={blackKeyWidthExpr}
							height={blackKeyHeightExpr}
							style={{
								position: "absolute",
								left: `calc(calc(${whiteKeyWidthExpr} * ${
									i + ((i > 1) as unknown as number) + 1
								}) - calc(${blackKeyWidthExpr} / 2))`,
								top: "0px",
							}}
						>
							{({ isHovered, isPressed }) => (
								<Box
									bg={
										isHovered ? (isPressed ? "gray.700" : "gray.800") : "black"
									}
									w="100%"
									h="100%"
									borderWidth="1px"
									borderColor="black"
									color="white"
									style={{
										justifyContent: "flex-end",
										alignItems: "center",
									}}
								>
									{isNoteVisible(
										showNoteNames,
										isPressed,
										isHovered,
										false
									) && (
										<Text
											style={{
												userSelect: "none",
												WebkitUserSelect: "none",
												MozUserSelect: "none",
												msUserSelect: "none",
											}}
											fontSize="xs"
											color="white"
										>
											{key.note + key.accidental}
										</Text>
									)}
								</Box>
							)}
						</Pressable>
					);
				})}
			</Row>
		</Box>
	);
};

Octave.defaultProps = {
	startNote: "C",
	endNote: "B",
	onNoteDown: () => {},
	onNoteUp: () => {},
};

export default Octave;
