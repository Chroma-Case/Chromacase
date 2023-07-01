import * as yup from 'yup';
import { ModelValidator } from './Model';

export const UserSettingsValidator = yup.object({
	userId: yup.number().required(),
	pushNotification: yup.boolean().required(),
    emailNotification: yup.boolean().required(),
    trainingNotification: yup.boolean().required(),
    newSongNotification: yup.boolean().required(),
    recommendations: yup.boolean().required(),
    weeklyReport: yup.boolean().required(),
    leaderBoard: yup.boolean().required(),
    showActivity: yup.boolean().required()
}).concat(ModelValidator);

interface UserSettings {
	notifications: {
		pushNotif: boolean;
		emailNotif: boolean;
		trainNotif: boolean;
		newSongNotif: boolean;
	};
	weeklyReport: boolean;
	leaderBoard: boolean;
	showActivity: boolean;
	recommendations: boolean;
}

export default UserSettings;
