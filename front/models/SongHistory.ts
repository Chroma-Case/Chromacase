import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';
import { ModelValidator } from './Model';
import { SongValidator } from './Song';


export const SongHistoryItemValidator = yup.object({
	songID: yup.number().required(),
	song: SongValidator.optional(),
	userID: yup.number().required(),
	info: yup.object({
		good: yup.number().required(),
		great: yup.number().required(),
		score: yup.number().required(),
		wrong: yup.number().required(),
		missed: yup.number().required(),
		perfect: yup.number().required(),
		max_score: yup.number().required(),
		max_streak: yup.number().required(),
		// there's also a current streak key but it doesn't
		// conceptually makes sense outside of the played game
	}).required(),
	score: yup.number().required(),
	playDate: yup.date().required(),
	difficulties: yup.mixed().required(),
}).concat(ModelValidator);
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
