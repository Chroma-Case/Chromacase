import Model, { ModelValidator } from './Model';
import SongDetails, { SongDetailsHandler, SongDetailsValidator } from './SongDetails';
import Artist, { ArtistValidator } from './Artist';
import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';
import API from '../API';
import { AlbumValidator } from './Album';
import { GenreValidator } from './Genre';

export type SongInclude = 'artist' | 'album' | 'genre' | 'SongHistory' | 'likedByUsers';

export const SongValidator = yup
	.object({
		name: yup.string().required(),
		midiPath: yup.string().required(),
		musicXmlPath: yup.string().required(),
		artistId: yup.number().required(),
		albumId: yup.number().required().nullable(),
		genreId: yup.number().required().nullable(),
		difficulties: SongDetailsValidator.required(),
		cover: yup.string().required(),
		artist: yup.lazy(() => ArtistValidator.default(undefined)).optional(),
		album: yup.lazy(() => AlbumValidator.default(undefined)).optional(),
		genre: yup.lazy(() => GenreValidator.default(undefined)).optional(),
	})
	.concat(ModelValidator)
	.transform((song: Song) => ({
		...song,
		cover: `${API.baseUrl}/song/${song.id}/illustration`,
	}));

export type Song = yup.InferType<typeof SongValidator>;

export const SongHandler: ResponseHandler<Song> = {
	validator: SongValidator,
};

export default Song;
