import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';

export const SongHistoryItemValidator = yup.object({
	songID: yup.number().required(),
	userID: yup.number().required(),
	score: yup.number().required(),
	difficulties: yup.mixed().required(),
});

export const SongHistoryItemHandler: ResponseHandler<
	yup.InferType<typeof SongHistoryItemValidator>,
	SongHistoryItem
> = {
	validator: SongHistoryItemValidator,
	transformer: (value) => ({
		...value,
		difficulties: value.difficulties,
	}),
};

export const SongHistoryValidator = yup.object({
	best: yup.number().required().nullable(),
	history: yup.array(SongHistoryItemValidator).required(),
});

export type SongHistory = yup.InferType<typeof SongHistoryValidator>;

export const SongHistoryHandler: ResponseHandler<SongHistory> = {
	validator: SongHistoryValidator,
	transformer: (value) => ({
		...value,
		history: value.history.map((item) => SongHistoryItemHandler.transformer(item)),
	}),
};

export type SongHistoryItem = {
	songID: number;
	userID: number;
	score: number;
	difficulties: object;
};

export default SongHistory;
