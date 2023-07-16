import Model, { ModelValidator } from './Model';
import SongDetails, { SongDetailsHandler, SongDetailsValidator } from './SongDetails';
import Artist from './Artist';
import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';
import API from '../API';

export const SongValidator = yup
	.object({
		name: yup.string().required(),
		midiPath: yup.string().required(),
		musicXmlPath: yup.string().required(),
		artistId: yup.number().required(),
		albumId: yup.number().required().nullable(),
		genreId: yup.number().required().nullable(),
		difficulties: SongDetailsValidator.required(),
		illustrationPath: yup.string().required(),
	})
	.concat(ModelValidator);

export const SongHandler: ResponseHandler<yup.InferType<typeof SongValidator>, Song> = {
	validator: SongValidator,
	transformer: (song) => ({
		id: song.id,
		name: song.name,
		artistId: song.artistId,
		albumId: song.albumId,
		genreId: song.genreId,
		details: SongDetailsHandler.transformer(song.difficulties),
		cover: `${API.baseUrl}/song/${song.id}/illustration`,
	}),
};

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
