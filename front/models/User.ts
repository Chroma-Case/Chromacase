import { Metrics } from "react-native-safe-area-context";
import Model from "./Model";
import UserSettings from "./UserSettings";

interface User extends Model {
	name: string;
	email: string;
	xp: number;
	premium: boolean;
	metrics: Metrics;
	settings: UserSettings;
}

export default User;