import Model, { ModelValidator } from './Model';
import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';

export const GenreValidator = yup
	.object({
		name: yup.string().required(),
	})
	.concat(ModelValidator);

export const GenreHandler: ResponseHandler<Genre> = {
	validator: GenreValidator,
	transformer: (value) => value
}

interface Genre extends Model {
	name: string;
}

export default Genre;
