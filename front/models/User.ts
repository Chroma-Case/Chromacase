import Model, { ModelValidator } from './Model';
import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';

export const UserValidator = yup
	.object({
		username: yup.string().required(),
		password: yup.string().required(),
		email: yup.string().required(),
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
			avatar: 'https://imgs.search.brave.com/RnQpFhmAFvuQsN_xTw7V-CN61VeHDBg2tkEXnKRYHAE/rs:fit:768:512:1/g:ce/aHR0cHM6Ly96b29h/c3Ryby5jb20vd3At/Y29udGVudC91cGxv/YWRzLzIwMjEvMDIv/Q2FzdG9yLTc2OHg1/MTIuanBn',
		},
	}),
};

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
