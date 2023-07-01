import * as yup from 'yup';

export const SongDetailsValidator = yup.object({
	length: yup.string().required(),
	rhythm: yup.string().required(),
	arpeggio: yup.string().required(),
	distance: yup.string().required(),
	lefthand: yup.string().required(),
	twohands: yup.string().required(),
	notecombo: yup.string().required(),
	precision: yup.string().required(),
	righthand: yup.string().required(),
	pedalpoint: yup.string().required(),
	chordtiming: yup.string().required(),
	leadhandchange: yup.string().required(),
	chordcomplexity: yup.string().required()
});

interface SongDetails {
	length: number;
	rhythm: number;
	arppegio: number;
	distance: number;
	lefthand: number;
	righthand: number;
	twohands: number;
	notecombo: number;
	precision: number;
	pedalpoint: number;
	chordtiming: number;
	leadheadchange: number;
	chordcomplexity: number;
}

export default SongDetails;
