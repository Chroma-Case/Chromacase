import { useTheme } from 'native-base';
import { Center, Spinner } from 'native-base';
import useColorScheme from '../hooks/colorScheme';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useMemo } from 'react';
const LoadingComponent = () => {
	const theme = useTheme();
	return <Spinner color={theme.colors.primary[500]} />;
};

const LoadingView = () => {
	return (
		<Center flex={1}>
			<LoadingComponent />
		</Center>
	);
};

export default LoadingComponent;
export { LoadingView };
