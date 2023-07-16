import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';

const ListValidator = <T>(itemType: yup.Schema<T>) => yup.array(itemType).required();

export const ListHandler = <A, R>(
	itemHandler: ResponseHandler<A, R>
): ResponseHandler<A[], R[]> => ({
	validator: ListValidator(itemHandler.validator),
	transformer: (plage) => plage.map((item) => itemHandler.transformer(item)),
});
