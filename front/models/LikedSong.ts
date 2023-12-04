import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';
import { SongValidator } from './Song';
import { ModelValidator } from './Model';

export const LikedSongValidator = yup
	.object({
		songId: yup.number().required(),
		song: yup.lazy(() => SongValidator.default(undefined)),
		addedDate: yup.date().required(),
	})
	.concat(ModelValidator);

export type LikedSong = yup.InferType<typeof LikedSongValidator>;

export const LikedSongHandler: ResponseHandler<LikedSong> = {
	validator: LikedSongValidator,
};

export default LikedSong;
