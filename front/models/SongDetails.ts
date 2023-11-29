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

export type SongDetails = yup.InferType<typeof SongDetailsValidator>;

export const SongDetailsHandler: ResponseHandler<SongDetails> = {
	validator: SongDetailsValidator,
};

export default SongDetails;
