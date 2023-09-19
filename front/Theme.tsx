import { NativeBaseProvider, extendTheme, useColorMode } from 'native-base';
import useColorScheme from './hooks/colorScheme';
import { useEffect } from 'react';

const ThemeProvider = ({ children }: { children: JSX.Element }) => {
	const colorScheme = useColorScheme();

	return (
		<NativeBaseProvider
			theme={extendTheme({
				config: {
					useSystemColorMode: false,
					initialColorMode: colorScheme,
				},
				fonts: {
					heading: 'Lexend',
					body: 'Lexend',
					mono: 'Lexend',
				},
				colors: {
					primary: {
						50: '#eff1fe',
						100: '#e7eafe',
						200: '#cdd4fd',
						300: '#5f74f7',
						400: '#5668de',
						500: '#4c5dc6',
						600: '#4757b9',
						700: '#394694',
						800: '#2b346f',
						900: '#212956',
					},
					secondary: {
						50: '#d8ffff',
						100: '#acffff',
						200: '#7dffff',
						300: '#4dffff',
						400: '#28ffff',
						500: '#18e5e6',
						600: '#00b2b3',
						700: '#007f80',
						800: '#004d4e',
						900: '#001b1d',
					},
					error: {
						50: '#ffe2e9',
						100: '#ffb1bf',
						200: '#ff7f97',
						300: '#ff4d6d',
						400: '#fe1d43',
						500: '#e5062b',
						600: '#b30020',
						700: '#810017',
						800: '#4f000c',
						900: '#200004',
					},
					notification: {
						50: '#ffe1e1',
						100: '#ffb1b1',
						200: '#ff7f7f',
						300: '#ff4c4c',
						400: '#ff1a1a',
						500: '#e60000',
						600: '#b40000',
						700: '#810000',
						800: '#500000',
						900: '#210000',
					},
				},
				components: {
					Button: {
						variants: {
							solid: () => ({
								rounded: 'full',
							}),
						},
					},
				},
			})}
		>
			{children}
		</NativeBaseProvider>
	);
};

const ColorSchemeProvider = (props: { children: JSX.Element }) => {
	const colorScheme = useColorScheme();
	const colorMode = useColorMode();

	useEffect(() => {
		colorMode.setColorMode(colorScheme);
	}, [colorScheme]);
	return props.children;
};

export default ThemeProvider;
export { ColorSchemeProvider };
