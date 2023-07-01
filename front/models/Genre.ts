import Model, { ModelValidator } from './Model';
import * as yup from 'yup';

export const GenreValidator = yup.object({
	name: yup.string().required()
}).concat(ModelValidator)


interface Genre extends Model {
	name: string;
}

export default Genre;
