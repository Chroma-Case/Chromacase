import Model, { ModelValidator } from './Model';
import * as yup from 'yup';

export const AlbumValidator = yup.object({
	name: yup.string().required(),
	artistId: yup.number().required()
}).concat(ModelValidator)

interface Album extends Model {
	name: string;
}

export default Album;
