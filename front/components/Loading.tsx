import { useTheme } from 'native-base';
import { Center, Spinner } from 'native-base';
const LoadingComponent = () => {
	const theme = useTheme();
	return <Spinner color={theme.colors.primary[500]} />;
};

const LoadingView = () => {
	return (
		<Center style={{ flexGrow: 1 }}>
			<LoadingComponent />
		</Center>
	);
};

export default LoadingComponent;
export { LoadingView };
