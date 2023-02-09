import { NativeBaseProvider, extendTheme } from 'native-base';
import { RootState, useSelector } from './state/Store';
import { SettingsState } from './state/SettingsSlice';
import { Appearance } from 'react-native';

const BaseTheme = {
	primary:
	{
		50: '#e6faea',
		100: '#c8e7d0',
		200: '#a7d6b5',
		300: '#86c498',
		400: '#65b47c',
		500: '#4b9a62',
		600: '#3a784b',
		700: '#275635',
		800: '#14341f',
		900: '#001405',
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
	}
}

const LightBackground = {
	50: '#f2f2f2',
	100: '#d9d9d9',
	200: '#bfbfbf',
	300: '#a6a6a6',
	400: '#8c8c8c',
	500: '#737373',
	600: '#595959',
	700: '#404040',
	800: '#262626',
	900: '#0d0d0d',
};

const LightTheme = {
	...BaseTheme,
	background: LightBackground,
	surface: LightBackground,
	onSurface: LightBackground,
	placeholder: LightBackground
};

const DarkBackground = {
	50: "#1a02a4",
	100: "#19048d",
	200: "#160577",
	300: "#140661",
	400: "#0f054b",
	500: "#0e0540",
	600: "#0c0533",
	700: "#0a0527",
	800: "#07041b",
	900: "#050310"
};

const DarkTheme = {
	...BaseTheme,
	background: DarkBackground,
	surface: DarkBackground,
	onSurface: DarkBackground,
	placeholder: DarkBackground
};



const ThemeProvider = ({ children }: { children: JSX.Element }) => {
	const colorScheme: SettingsState['colorScheme'] = useSelector((state: RootState) => state.settings.settings.colorScheme);
	console.log(colorScheme);
	const systemColorScheme = Appearance.getColorScheme();
	return <NativeBaseProvider theme={extendTheme({
		colors: colorScheme == 'dark'
			? DarkTheme
			: colorScheme == 'light'
				? LightTheme
				: systemColorScheme == 'dark'
					? DarkTheme
					: LightTheme
	})}>
		{ children }
	</NativeBaseProvider>;
}

export default ThemeProvider;