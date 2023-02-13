import { Appearance } from "react-native";
import { useSelector } from "react-redux";
import { SettingsState } from "../state/SettingsSlice";
import { RootState } from "../state/Store";

const useColorScheme = (): 'light' | 'dark' => {
	const colorScheme: SettingsState['colorScheme'] = useSelector((state: RootState) => state.settings.settings.colorScheme);
	const systemColorScheme = Appearance.getColorScheme();

	if (colorScheme == 'system') {
		return systemColorScheme ?? 'light';
	}
	return colorScheme;
}

export default useColorScheme;