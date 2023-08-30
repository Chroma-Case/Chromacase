import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';

export const LikedSongItemValidator = yup.object({
    songId: yup.number().required(),
    addedDate: yup.date().required(),
});

export const LikedSongItemHandler: ResponseHandler<
        yup.InferType<typeof LikedSongItemValidator>,
        LikedSongItem
    > = {
    validator: LikedSongItemValidator,
    transformer: (value) => ({
    ...value,
    }),
};

export const LikedSongValidator = yup.object({
    songId: yup.number().required(),
    history: yup.array(LikedSongItemValidator).required(),
});

export type LikedSong = yup.InferType<typeof LikedSongValidator>;

export const LikedSongHandler: ResponseHandler<LikedSong> = {
    validator: LikedSongValidator,
    transformer: (value) => ({
    ...value,
    history: value.history.map((item) =>
        LikedSongItemHandler.transformer(item)
        ),
    }),
};

export type LikedSongItem = {
    songId: number;
    addedDate: Date;
};

export default LikedSong;