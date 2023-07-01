import * as yup from 'yup';

export const SongHistoryValidator = yup.object({
	songID: yup.number().required(),
	userID: yup.number().required(),
	score: yup.number().required(),
	difficulties: yup.mixed()
});

interface SongHistory {
	songID: number;
	userID: number;
	score: number;
	difficulties: JSON;
}

export default SongHistory;
