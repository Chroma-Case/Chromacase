import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';

export const SongCursorInfosValidator = yup.object({
	pageWidth: yup.number().required(),
	cursors: yup
		.array()
		.of(
			yup.object({
				x: yup.number().required(),
				y: yup.number().required(),
				width: yup.number().required(),
				height: yup.number().required(),
				timestamp: yup.number().required(),
				timing: yup.number().required(),
				note: yup
					.object({
						note: yup.number().required(),
						gain: yup.number().required(),
						duration: yup.number().required(),
					})
					.required(),
			})
		)
		.required(),
});

export const SongCursorInfosHandler: ResponseHandler<
	yup.InferType<typeof SongCursorInfosValidator>,
	SongCursorInfos
> = {
	validator: SongCursorInfosValidator,
	transformer: (songCursorInfos: yup.InferType<typeof SongCursorInfosValidator>) => ({
		pageWidth: songCursorInfos.pageWidth,
		cursors: songCursorInfos.cursors.map((cursor) => ({
			x: cursor.x,
			y: cursor.y,
			width: cursor.width,
			height: cursor.height,
			timestamp: cursor.timestamp,
			timing: cursor.timing,
			note: {
				note: cursor.note.note,
				gain: cursor.note.gain,
				duration: cursor.note.duration,
			},
		})),
	}),
};

export interface CursorInfoItem {
	x: number;
	y: number;
	width: number;
	height: number;
	timestamp: number;
	timing: number;
	note: {
		note: number;
		gain: number;
		duration: number;
	};
}

export interface SongCursorInfos {
	pageWidth: number;
	cursors: CursorInfoItem[];
}
