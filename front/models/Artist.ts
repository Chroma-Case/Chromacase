import Model, { ModelValidator } from './Model';
import * as yup from 'yup';

export const ArtistValidator = yup.object({
	name: yup.string().required()
}).concat(ModelValidator)

interface Artist extends Model {
	name: string;
	picture?: string;
}

export default Artist;
