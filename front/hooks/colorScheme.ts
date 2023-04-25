import { Appearance } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../state/Store";

const useColorScheme = (): 'light' | 'dark' => {
	const colorScheme = useSelector((state: RootState) => state.settings.local.colorScheme);
	const systemColorScheme = Appearance.getColorScheme();

	if (colorScheme == 'system') {
		return systemColorScheme ?? 'light';
	}
	return colorScheme;
}

export default useColorScheme;