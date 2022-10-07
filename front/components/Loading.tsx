import { useTheme } from "native-base";
import { ActivityIndicator } from "react-native-paper";
const LoadingComponent = () => {
	const theme = useTheme();
	return <ActivityIndicator color={theme.colors.primary[500]}/>
}

export default LoadingComponent;