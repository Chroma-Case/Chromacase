import Model, { ModelValidator } from './Model';
import * as yup from 'yup'

export const UserValidator = yup.object({
	username: yup.string().required(),
	password: yup.string().required(),
	email: yup.string().required(),
	isGuest: yup.boolean().required(),
	partyPlayed: yup.number().required()
}).concat(ModelValidator);

interface User extends Model {
	name: string;
	email: string;
	isGuest: boolean;
	premium: boolean;
	data: UserData;
}

interface UserData {
	gamesPlayed: number;
	xp: number;
	avatar: string | undefined;
	createdAt: Date;
}

export default User;
