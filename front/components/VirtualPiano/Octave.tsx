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
		return new PianoKey(k.note, k.accidental, number);
	});

	const startNoteIndex = getKeyIndex(startNote, oK);
	const endNoteIndex = getKeyIndex(endNote, oK);
	const keys = oK.slice(startNoteIndex, endNoteIndex + 1);

	const whiteKeys = keys.filter((k) => k?.accidental === undefined);
	const blackKeys = keys.filter((k) => k?.accidental !== undefined);

	const whiteKeyWidthExpr = '50px';
	const whiteKeyHeightExpr = '200px';
	const blackKeyWidthExpr = '25px';
	const blackKeyHeightExpr = '100px';

	return (
		<Box width={"350px"} height={"200px"}>
		<ZStack>
			<Row>
				{whiteKeys.map((key, i) => {
					return (
						<Pressable
							key={i}
							onPressIn={() => onNoteDown(key)}
							onPressOut={() => onNoteUp(key)}
						>
							<Box
								bg="white"
								w="50px"
								h="200px"
								borderWidth="1px"
								borderColor="black"
								justifyContent="flex-end"
								alignItems="center"
							>
								<Text fontSize="xl">
									{key.note}
								</Text>
							</Box>
						</Pressable>
					);
				})}
			</Row>
			<Row>
				{blackKeys.map((key, i) => {
					return (
						<Pressable
							key={i}
							onPressIn={() => onNoteDown(key)}
							onPressOut={() => onNoteUp(key)}
						>
							<Box
								bg="black"
								w="25px"
								h="120px"
								borderWidth="1px"
								borderColor="black"
								color="white"
								style={{
									position: "absolute",
									left: `${(i + ((i > 1) as unknown as number)) * 50 + (50 - (25 / 2))}px`,
									top: "0px",
									justifyContent: "flex-end",
									alignItems: "center",
								}}
							>
								<Text fontSize="xs" color="white">
									{key.note + key.accidental}
								</Text>
							</Box>
						</Pressable>
					);
				})}
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
