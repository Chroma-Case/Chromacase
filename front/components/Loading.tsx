import { useTheme } from "native-base";
import { Spinner } from "native-base";
const LoadingComponent = () => {
	const theme = useTheme();
	return <Spinner color={theme.colors.primary[500]}/>
}

export default LoadingComponent;