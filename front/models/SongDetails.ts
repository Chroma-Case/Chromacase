import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';

export const SongDetailsValidator = yup.object({
	length: yup.number().required(),
	rhythm: yup.number().required(),
	arpeggio: yup.number().required(),
	distance: yup.number().required(),
	lefthand: yup.number().required(),
	twohands: yup.number().required(),
	notecombo: yup.number().required(),
	precision: yup.number().required(),
	righthand: yup.number().required(),
	pedalpoint: yup.number().required(),
	chordtiming: yup.number().required(),
	leadhandchange: yup.number().required(),
	chordcomplexity: yup.number().required(),
});

export const SongDetailsHandler: ResponseHandler<
	yup.InferType<typeof SongDetailsValidator>,
	SongDetails
> = {
	validator: SongDetailsValidator,
	transformer: (value) => value,
};

interface SongDetails {
	length: number;
	rhythm: number;
	arpeggio: number;
	distance: number;
	lefthand: number;
	righthand: number;
	twohands: number;
	notecombo: number;
	precision: number;
	pedalpoint: number;
	chordtiming: number;
	leadhandchange: number;
	chordcomplexity: number;
}

export default SongDetails;
