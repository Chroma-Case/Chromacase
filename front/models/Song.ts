import { ModelValidator } from './Model';
import { SongDetailsValidator } from './SongDetails';
import { ArtistValidator } from './Artist';
import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';
import API from '../API';
import { AlbumValidator } from './Album';
import { GenreValidator } from './Genre';
import { SongHistoryItemWithoutSongValidator } from './SongHistory';

export type SongInclude = 'artist' | 'album' | 'genre' | 'SongHistory' | 'likedByUsers';

export const SongValidator = yup
	.object()
	.shape({
		name: yup.string().required(),
		midiPath: yup.string().required(),
		musicXmlPath: yup.string().required(),
		artistId: yup.number().required(),
		albumId: yup.number().required().nullable(),
		genreId: yup.number().required().nullable(),
		difficulties: SongDetailsValidator.required(),
		details: SongDetailsValidator.required(),
		cover: yup.string().required(),
		SongHistory: yup
			.lazy(() => yup.array(SongHistoryItemWithoutSongValidator.default(undefined)))
			.optional(),
		bestScore: yup.number().optional().nullable(),
		lastScore: yup.number().optional().nullable(),
		artist: yup.lazy(() => ArtistValidator.default(undefined)).optional(),
		album: yup.lazy(() => AlbumValidator.default(undefined)).optional(),
		genre: yup.lazy(() => GenreValidator.default(undefined)).optional(),
		likedByUsers: yup
			.lazy(() =>
				yup.array(yup.object({ userId: yup.number().required() })).default(undefined)
			)
			.optional(),
		isLiked: yup.bool().optional(),
	})
	.concat(ModelValidator)
	.transform((song: Song) => ({
		...song,
		cover: `${API.baseUrl}/song/${song.id}/illustration`,
		details: song.difficulties,
		bestScore:
			song.SongHistory?.map(({ info }) => info.score)
				.sort()
				.at(-1) ?? null,
		lastScore:
			song.SongHistory?.map(({ info, playDate }) => ({ info, playDate }))
				.sort(
					(a, b) =>
						yup.date().cast(a.playDate)!.getTime() -
						yup.date().cast(b.playDate)!.getTime()
				)
				.at(0)?.info.score ?? null,
		isLiked: song.likedByUsers?.some(() => true),
	}));

export type Song = yup.InferType<typeof SongValidator>;

export const SongHandler: ResponseHandler<yup.InferType<typeof SongValidator>> = {
	validator: SongValidator,
};

export default Song;
