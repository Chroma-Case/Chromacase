import {
	Note,
	PianoKey,
	NoteNameBehavior,
	octaveKeys,
	Accidental,
} from "../../models/Piano";
import { Box, Row, Pressable } from "native-base";

const notesList: Array<Note> = ["C", "D", "E", "F", "G", "A", "B"];
const accidentalsList: Array<Accidental> = ["#", "b", "##", "bb"];

const getKeyIndex = (k: PianoKey, keys: PianoKey[]) => {
	for (let i = 0; i < keys.length; i++) {
		if (
			keys[i]?.note === k.note &&
			((keys[i]?.accidental && keys[i]?.accidental === k.accidental) ||
				(!keys[i]?.accidental && !k.accidental))
		) {
			return i;
		}
	}
	return -1;
};

type OctaveProps = {
	number: number;
	startNote: PianoKey;
	endNote: PianoKey;
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

	return (
		<Row>
			{keys.map((key, i) => {
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
	);
};

Octave.defaultProps = {
	startNote: "C",
	endNote: "B",
	onNoteDown: () => {},
	onNoteUp: () => {},
};

export default Octave;
