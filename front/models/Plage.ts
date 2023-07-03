import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';

// Ty https://github.com/Arthi-chaud/Meelo/blob/master/front/src/models/pagination.ts
export const PlageValidator = <T>(itemType: yup.Schema<T>) =>
	yup.object({
		data: yup.array(itemType).required(),
		metadata: yup.object({
			/**
			 * Current route
			 */
			this: yup.string().required(),
			/**
			 * route to use for the next items
			 */
			next: yup.string().required().nullable(),
			/**
			 * route to use for the previous items
			 */
			previous: yup.string().required().nullable(),
		}),
	});

type Plage<T> = yup.InferType<ReturnType<typeof PlageValidator<T>>>;

export const PlageHandler = <A, R>(
	itemHandler: ResponseHandler<A, R>
): ResponseHandler<Plage<A>, Plage<R>> => ({
	validator: PlageValidator(itemHandler.validator),
	transformer: (plage) => ({
		...plage,
		data: plage.data.map((item) => itemHandler.transformer(item)),
	}),
});
