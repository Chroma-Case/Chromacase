import {
	Note,
	PianoKey,
	NoteNameBehavior,
	octaveKeys,
	isAccidental,
	HighlightedKey,
} from "../../models/Piano";
import { Box, Row, Text } from "native-base";
import PianoKeyComp from "./PianoKeyComp";

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
		return new PianoKey(k.note, number);
	});

	const notesArray = oK.map((k) => k.note);
	const startNoteIndex = notesArray.indexOf(startNote);
	const endNoteIndex = notesArray.indexOf(endNote);
	const keys = oK.slice(startNoteIndex, endNoteIndex + 1);

	const whiteKeys = keys.filter((k) => !isAccidental(k));
	const blackKeys = keys.filter(isAccidental);

	const whiteKeyWidthExpr = "calc(100% / 7)";
	const whiteKeyHeightExpr = "100%";
	const blackKeyWidthExpr = "calc(100% / 13)";
	const blackKeyHeightExpr = "calc(100% / 1.5)";

	return (
		<Box {...props}>
			<Row height={"100%"} width={"100%"}>
				{whiteKeys.map((key, i) => {
					const highlightedKey = highlightedNotes.find(
						(h) => h.key.note === key.note
					);
					const isHighlighted = highlightedKey !== undefined;
					const highlightColor =
						highlightedKey?.bgColor ?? defaultHighlightColor;
					return (
						<PianoKeyComp
							pianoKey={key}
							showNoteName={showNoteNames}
							bg={isHighlighted ? highlightColor : whiteKeyBg}
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
						(h) => h.key.note === key.note
					);
					const isHighlighted = highlightedKey !== undefined;
					const highlightColor =
						highlightedKey?.bgColor ?? defaultHighlightColor;
					return (
						<PianoKeyComp
							pianoKey={key}
							showNoteName={showNoteNames}
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
