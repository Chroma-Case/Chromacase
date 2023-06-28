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
	const colorScheme = useColorScheme();
	const bgColor = useMemo(() => {
		switch (colorScheme) {
			case 'light':
				return DefaultTheme.colors.background;
			case 'dark':
				return DarkTheme.colors.background;
		}
	}, [colorScheme]);

	return (
		<Center style={{ flexGrow: 1, backgroundColor: bgColor }}>
			<LoadingComponent />
		</Center>
	);
};

export default LoadingComponent;
export { LoadingView };
