import Model, { ModelValidator } from './Model';
import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';
import API from '../API';

export const UserValidator = yup
	.object({
		username: yup.string().required(),
		password: yup.string().required().nullable(),
		emailVerified: yup.boolean().required(),
		email: yup.string().required().nullable(),
		googleID: yup.string().required().nullable(),
		isGuest: yup.boolean().required(),
		partyPlayed: yup.number().required(),
	})
	.concat(ModelValidator);

export const UserHandler: ResponseHandler<yup.InferType<typeof UserValidator>, User> = {
	validator: UserValidator,
	transformer: (value) => ({
		...value,
		name: value.username,
		premium: false,
		data: {
			gamesPlayed: value.partyPlayed as number,
			xp: 0,
			createdAt: new Date('2023-04-09T00:00:00.000Z'),
			avatar: `${API.baseUrl}/users/${value.id}/picture`,
		},
	}),
};

interface User extends Model {
	name: string;
	emailVerified: boolean;
	// guest accounts don't have a mail
	email: string | null;
	googleID: string | null;
	isGuest: boolean;
	premium: boolean;
	data: UserData;
}

interface UserData {
	gamesPlayed: number;
	xp: number;
	avatar: string;
	createdAt: Date;
}

export default User;
