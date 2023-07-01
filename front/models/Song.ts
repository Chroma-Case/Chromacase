import Model, { ModelValidator } from './Model';
import SongDetails, { SongDetailsValidator } from './SongDetails';
import Artist from './Artist';
import * as yup from 'yup';

export const SongValidator = yup.object({
	name: yup.string().required(),
	midiPath: yup.string().required(),
	musicXmlPath: yup.string().required(),
	artistId: yup.number().required(),
	albumId: yup.number().required().nullable(),
	genreId: yup.number().required().nullable(),
	difficulties: SongDetailsValidator.required(),
	illustrationPath: yup.string().required()
}).concat(ModelValidator);

interface Song extends Model {
	id: number;
	name: string;
	artistId: number;
	albumId: number | null;
	genreId: number | null;
	cover: string;
	details: SongDetails;
}

export interface SongWithArtist extends Song {
	artist: Artist;
}

export default Song;
