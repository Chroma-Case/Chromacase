import * as yup from 'yup';

// Ty https://github.com/Arthi-chaud/Meelo/blob/master/front/src/models/pagination.ts
export const PlageValidator = <T>(itemType: yup.Schema<T>) => yup.object({
	items: yup.array(itemType).required(),
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
		previous: yup.string().required().nullable()
	})
});
