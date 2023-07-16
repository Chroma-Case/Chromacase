import Model, { ModelValidator } from './Model';
import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';

export const ArtistValidator = yup
	.object({
		name: yup.string().required(),
	})
	.concat(ModelValidator);

export const ArtistHandler: ResponseHandler<Artist> = {
	validator: ArtistValidator,
	transformer: (value) => value,
};

interface Artist extends Model {
	name: string;
}

export default Artist;
