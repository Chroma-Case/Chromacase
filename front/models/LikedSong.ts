import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';
import Song from './Song';
import Model, { ModelValidator } from './Model';

export const LikedSongValidator = yup
	.object({
		songId: yup.number().required(),
		addedDate: yup.date().required(),
	})
	.concat(ModelValidator);

export const LikedSongHandler: ResponseHandler<
	yup.InferType<typeof LikedSongValidator>,
	LikedSong
> = {
	validator: LikedSongValidator,
	transformer: (likedSong) => ({
		id: likedSong.id,
		songId: likedSong.songId,
		addedDate: likedSong.addedDate,
	}),
};
interface LikedSong extends Model {
	songId: number;
	addedDate: Date;
}

export interface LikedSongWithDetails extends LikedSong {
	details: Song;
}

export default LikedSong;
