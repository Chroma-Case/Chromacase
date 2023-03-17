import { Note } from "./VirtualPiano";
import { Box, Row, Pressable } from "native-base";

type OctaveProps = {
	number: number;
	startNote: Note;
	endNote: Note;
	onNoteDown: (note: Note) => void;
	onNoteUp: (note: Note) => void;
};

const Octave = ({
	number,
	startNote,
	endNote,
	onNoteDown,
	onNoteUp,
}: OctaveProps) => {
	const notesList: Array<Note> = ["C", "D", "E", "F", "G", "A", "B"];
	const startNoteIndex = notesList.indexOf(startNote);
	const endNoteIndex = notesList.indexOf(endNote);
	const whiteKeys = notesList.slice(startNoteIndex, endNoteIndex + 1);

	return (
		<Row>
			{whiteKeys.map((note) => {
				return (
					<Pressable
						onPressIn={() => onNoteDown(note + number)}
						onPressOut={() => onNoteUp(note + number)}
					>
						<Box
							key={note}
							bg="white"
							w="50px"
							h="200px"
							borderWidth="1px"
							borderColor="black"
						>
							{note}
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
