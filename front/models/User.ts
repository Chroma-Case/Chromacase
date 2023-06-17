import UserData from './UserData';
import Model from './Model';
import UserSettings from './UserSettings';

interface User extends Model {
	name: string;
	email: string;
	isGuest: boolean;
	premium: boolean;
	data: UserData;
	settings: UserSettings;
}

export default User;
