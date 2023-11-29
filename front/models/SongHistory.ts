import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';
import { SongValidator } from './Song';

export const SongHistoryItemValidator = yup.object({
	songID: yup.number().required(),
	song: SongValidator.required(),
	userID: yup.number().required(),
	score: yup.number().required(),
	playDate: yup.date().required(),
	difficulties: yup.mixed().required(),
});
export type SongHistoryItem = yup.InferType<typeof SongHistoryItemValidator>;

export const SongHistoryItemHandler: ResponseHandler<SongHistoryItem> = {
	validator: SongHistoryItemValidator,
};

export const SongHistoryValidator = yup.object({
	best: yup.number().required().nullable(),
	history: yup.array(SongHistoryItemValidator).required(),
});

export type SongHistory = yup.InferType<typeof SongHistoryValidator>;

export const SongHistoryHandler: ResponseHandler<SongHistory> = {
	validator: SongHistoryValidator,
};

export default SongHistory;
