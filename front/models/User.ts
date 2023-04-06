import Metrics from "./Metrics";
import Model from "./Model";
import UserSettings from "./UserSettings";

interface User extends Model {
	name: string;
	email: string;
	isGuest: boolean;
	xp: number;
	premium: boolean;
	metrics: Metrics;
	settings: UserSettings;
}

export default User;