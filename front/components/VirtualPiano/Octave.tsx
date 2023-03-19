import {
	Note,
	PianoKey,
	NoteNameBehavior,
	octaveKeys,
	Accidental,
	HighlightedKey,
} from "../../models/Piano";
import { Box, Row, Pressable, Text } from "native-base";
import PianoKeyComp from "./PianoKeyComp";

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
	if (showNoteNamesPolicy === NoteNameBehavior.always) return true;
	if (showNoteNamesPolicy === NoteNameBehavior.never) return false;

	if (showNoteNamesPolicy === NoteNameBehavior.onpress) {
		return isPressed;
	} else if (showNoteNamesPolicy === NoteNameBehavior.onhover) {
		return isHovered;
	} else if (showNoteNamesPolicy === NoteNameBehavior.onhighlight) {
		return isHighlighted;
	}
	return false;
};

type OctaveProps = Parameters<typeof Box>[0] & {
	number: number;
	startNote: Note;
	endNote: Note;
	showNoteNames: NoteNameBehavior;
	showOctaveNumber: boolean;
	whiteKeyBg: string;
	whiteKeyBgPressed: string;
	whiteKeyBgHovered: string;
	blackKeyBg: string;
	blackKeyBgPressed: string;
	blackKeyBgHovered: string;
	highlightedNotes: Array<HighlightedKey>;
	defaultHighlightColor: string;
	onNoteDown: (note: PianoKey) => void;
	onNoteUp: (note: PianoKey) => void;
};

const Octave = (props: OctaveProps) => {
	const {
		number,
		startNote,
		endNote,
		showNoteNames,
		showOctaveNumber,
		whiteKeyBg,
		whiteKeyBgPressed,
		whiteKeyBgHovered,
		blackKeyBg,
		blackKeyBgPressed,
		blackKeyBgHovered,
		highlightedNotes,
		defaultHighlightColor,
		onNoteDown,
		onNoteUp,
	} = props;
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
					const highlightedKey = highlightedNotes.find(
						(h) =>
							h.key.note === key.note && h.key.accidental === key.accidental
					);
					const isHighlighted = highlightedKey !== undefined;
					const highlightColor =
						highlightedKey?.bgColor ?? defaultHighlightColor;
					return (
						<PianoKeyComp
							key={i} 
							pianoKey={key}
							bg={isHighlighted ? highlightColor :whiteKeyBg}
							bgPressed={isHighlighted ? highlightColor : whiteKeyBgPressed}
							bgHovered={isHighlighted ? highlightColor : whiteKeyBgHovered}
							onKeyDown={() => onNoteDown(key)}
							onKeyUp={() => onNoteUp(key)}
							style={{
								width: whiteKeyWidthExpr,
								height: whiteKeyHeightExpr,
							}}

						/>
					);
				})}
				{blackKeys.map((key, i) => {
					const highlightedKey = highlightedNotes.find(
						(h) =>
							h.key.note === key.note && h.key.accidental === key.accidental
					);
					const isHighlighted = highlightedKey !== undefined;
					const highlightColor =
						highlightedKey?.bgColor ?? defaultHighlightColor;
					return (
						<PianoKeyComp
							key={i}
							pianoKey={key}
							bg={isHighlighted ? highlightColor : blackKeyBg}
							bgPressed={isHighlighted ? highlightColor : blackKeyBgPressed}
							bgHovered={isHighlighted ? highlightColor : blackKeyBgHovered}
							onKeyDown={() => onNoteDown(key)}
							onKeyUp={() => onNoteUp(key)}
							style={{
								width: blackKeyWidthExpr,
								height: blackKeyHeightExpr,
								position: "absolute",
								left: `calc(calc(${whiteKeyWidthExpr} * ${
									i + ((i > 1) as unknown as number) + 1
								}) - calc(${blackKeyWidthExpr} / 2))`,
								top: "0px",
							}}
							text={{
								color: "white",
								fontSize: "xs",
							}}
						/>
					);
				})}
			</Row>
			{showOctaveNumber && (
				<Text
					style={{
						userSelect: "none",
						WebkitUserSelect: "none",
						MozUserSelect: "none",
						msUserSelect: "none",
					}}
					fontSize="2xs"
					color="black"
					position="absolute"
					bottom="0px"
					left="2px"
					m="2px"
				>
					{number}
				</Text>
			)}
		</Box>
	);
};

Octave.defaultProps = {
	startNote: "C",
	endNote: "B",
	showNoteNames: "onpress",
	showOctaveNumber: false,
	whiteKeyBg: "white",
	whiteKeyBgPressed: "gray.200",
	whiteKeyBgHovered: "gray.100",
	blackKeyBg: "black",
	blackKeyBgPressed: "gray.600",
	blackKeyBgHovered: "gray.700",
	highlightedNotes: [],
	defaultHighlightColor: "#FF0000",
	onNoteDown: () => {},
	onNoteUp: () => {},
};

export default Octave;
