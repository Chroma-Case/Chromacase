import {
	Note,
	PianoKey,
	NoteNameBehavior,
	octaveKeys,
	Accidental,
} from "../../models/Piano";
import { Box, Row, Pressable, ZStack } from "native-base";

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

type OctaveProps = {
	number: number;
	startNote: Note;
	endNote: Note;
	onNoteDown: (note: PianoKey) => void;
	onNoteUp: (note: PianoKey) => void;
};

const Octave = ({
	number,
	startNote,
	endNote,
	onNoteDown,
	onNoteUp,
}: OctaveProps) => {
	const oK: PianoKey[] = octaveKeys.map((k) => {
		return { ...k, number: number };
	});

	const startNoteIndex = getKeyIndex(startNote, oK);
	const endNoteIndex = getKeyIndex(endNote, oK);
	const keys = oK.slice(startNoteIndex, endNoteIndex + 1);

	const whiteKeys = octaveKeys.filter((k) => k?.accidental === undefined);
	const blackKeys = octaveKeys.filter((k) => k?.accidental !== undefined);

	return (
		<Box width={"350px"} height={"200px"}>
		<ZStack>
			<Row>
				{whiteKeys.map((key, i) => {
					return (
						<Pressable
							onPressIn={() => onNoteDown(key)}
							onPressOut={() => onNoteUp(key)}
						>
							<Box
								key={i}
								bg="white"
								w="50px"
								h="200px"
								borderWidth="1px"
								borderColor="black"
							>
								{key.toString()}
							</Box>
						</Pressable>
					);
				})}
			</Row>
			<Row>
				{blackKeys.map((key, i) => {
					return (
						<Pressable
							onPressIn={() => onNoteDown(key)}
							onPressOut={() => onNoteUp(key)}
						>
							<Box
								key={i}
								bg="black"
								w="25px"
								h="100px"
								borderWidth="1px"
								borderColor="black"
								marginLeft="12.5px"
							>
								{key.toString()}
							</Box>
						</Pressable>
					);
				})}
				;
			</Row>
		</ZStack>
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
