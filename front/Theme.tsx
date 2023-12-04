import { NativeBaseProvider, extendTheme, useColorMode } from 'native-base';
import useColorScheme from './hooks/colorScheme';
import { useEffect } from 'react';
import { Platform } from 'react-native';

const defaultLightGlassmorphism = {
	50: 'rgba(255,255,255,0.9)',
	100: 'rgba(255,255,255,0.1)',
	200: 'rgba(255,255,255,0.2)',
	300: 'rgba(255,255,255,0.3)',
	400: 'rgba(255,255,255,0.4)',
	500: 'rgba(255,255,255,0.5)',
	600: 'rgba(255,255,255,0.6)',
	700: 'rgba(255,255,255,0.7)',
	800: 'rgba(255,255,255,0.8)',
	900: 'rgba(255,255,255,0.9)',
	1000: 'rgba(255,255,255,1)',
};
// shodws are hugely visible on phone so we trick the colors without alpha
const phoneLightGlassmorphism = {
	50: 'rgb(200, 204, 254)',
	100: 'rgb(204, 208, 254)',
	200: 'rgb(210, 214, 254)',
	300: 'rgb(214, 218, 254)',
	400: 'rgb(220, 222, 254)',
	500: 'rgb(230, 234, 254)',
	600: 'rgb(234, 236, 254)',
	700: 'rgb(240, 242, 254)',
	800: 'rgb(244, 246, 254)',
	900: 'rgb(248, 250, 254)',
	1000: 'rgb(252, 254, 254)',
};
const lightGlassmorphism =
	Platform.OS === 'web' ? defaultLightGlassmorphism : phoneLightGlassmorphism;
const darkGlassmorphism = {
	50: 'rgba(16,16,20,0.9)',
	100: 'rgba(16,16,20,0.1)',
	200: 'rgba(16,16,20,0.2)',
	300: 'rgba(16,16,20,0.3)',
	400: 'rgba(16,16,20,0.4)',
	500: 'rgba(16,16,20,0.5)',
	600: 'rgba(16,16,20,0.6)',
	700: 'rgba(16,16,20,0.7)',
	800: 'rgba(16,16,20,0.8)',
	900: 'rgba(16,16,20,0.9)',
	1000: 'rgba(16,16,20,1)',
};

const ThemeProvider = ({ children }: { children: JSX.Element }) => {
	const colorScheme = useColorScheme();

	const glassmorphism = colorScheme === 'light' ? lightGlassmorphism : darkGlassmorphism;
	const text = colorScheme === 'light' ? darkGlassmorphism : lightGlassmorphism;

	return (
		<NativeBaseProvider
			isSSR={false}
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
					text: text,
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
						50: '#f7f3ff',
						100: '#f3edfe',
						200: '#e6d9fe',
						300: '#ae84fb',
						400: '#9d77e2',
						500: '#8b6ac9',
						600: '#8363bc',
						700: '#684f97',
						800: '#4e3b71',
						900: '#3d2e58',
					},
					error: {
						50: '#f7f3ff',
						100: '#f3edfe',
						200: '#e6d9fe',
						300: '#ae84fb',
						400: '#9d77e2',
						500: '#8b6ac9',
						600: '#8363bc',
						700: '#684f97',
						800: '#4e3b71',
						900: '#3d2e58',
					},
					alert: {
						50: '#fff2f1',
						100: '#ffebea',
						200: '#ffd6d3',
						300: '#ff7a72',
						400: '#e66e67',
						500: '#cc625b',
						600: '#bf5c56',
						700: '#994944',
						800: '#733733',
						900: '#592b28',
					},
					notification: {
						50: '#fdfbec',
						100: '#fcf9e2',
						200: '#f8f3c3',
						300: '#ead93c',
						400: '#d3c336',
						500: '#bbae30',
						600: '#b0a32d',
						700: '#8c8224',
						800: '#69621b',
						900: '#524c15',
					},
					black: {
						50: '#e7e7e8',
						100: '#dbdbdc',
						200: '#b5b5b6',
						300: '#101014',
						400: '#0e0e12',
						500: '#0d0d10',
						600: '#0c0c0f',
						700: '#0a0a0c',
						800: '#070709',
						900: '#060607',
					},
					red: {
						50: '#fdedee',
						100: '#fce4e5',
						200: '#f9c7c9',
						300: '#ed4a51',
						400: '#d54349',
						500: '#be3b41',
						600: '#b2383d',
						700: '#8e2c31',
						800: '#6b2124',
						900: '#531a1c',
					},
					coolGray: glassmorphism,
				},
				components: {
					Button: {
						baseStyle: () => ({
							borderRadius: 'md',
						}),
					},
					Link: {
						defaultProps: {
							isUnderlined: false,
						},
						baseStyle: () => ({
							_text: {
								color: 'secondary.300',
							},
							_hover: {
								isUnderlined: true,
								_text: {
									color: 'secondary.400',
								},
							},
						}),
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
