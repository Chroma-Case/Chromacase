import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';

export const SongCursorInfosValidator = yup.object({
	pageWidth: yup.number().required(),
	pageHeight: yup.number().required(),
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
				notes: yup
					.array()
					.of(
						yup.object({
							note: yup.number().required(),
							gain: yup.number().required(),
							duration: yup.number().required(),
						})
					)
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
		pageHeight: songCursorInfos.pageHeight,
		cursors: songCursorInfos.cursors.map((cursor) => ({
			x: cursor.x,
			y: cursor.y,
			width: cursor.width,
			height: cursor.height,
			timestamp: cursor.timestamp,
			timing: cursor.timing,
			notes: cursor.notes.map((n) => ({
				note: n.note,
				gain: n.gain,
				duration: n.duration,
			})),
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
	notes: {
		note: number;
		gain: number;
		duration: number;
	}[];
}

export interface SongCursorInfos {
	pageWidth: number;
	pageHeight: number;
	cursors: CursorInfoItem[];
}
