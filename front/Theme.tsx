import { NativeBaseProvider, extendTheme } from 'native-base';
import { RootState, useSelector } from './state/Store';
import { SettingsState } from './state/SettingsSlice';
import { Appearance } from 'react-native';

const baseTheme = {
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
	secondary:
	{
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
	error:
	{
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
	placeholder:
	{
		50: '#fbf0f2',
		100: '#dcd8d9',
		200: '#bfbfbf',
		300: '#a6a6a6',
		400: '#8c8c8c',
		500: '#737373',
		600: '#595959',
		700: '#404040',
		800: '#282626',
		900: '#150a0d',
	},
	notification:
	{
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

const lightBackground = {
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

const lightTheme = {
	...baseTheme,
	background: lightBackground,
	onSurface: lightBackground,
	surface: lightBackground,
	text: lightBackground,
}

const darkBackground = {
	50: "#3f3a3a",
	100: "#393636",
	200: "#343232",
	300: "#2e2e2e",
	400: "#292929",
	500: "#252626",
	600: "#222424",
	700: "#1f2121",
	800: "#1b1f1f",
	900: "#181c1c"
  }

const darkTheme = {
	...baseTheme,
	background: darkBackground,
	onSurface: darkBackground,
	surface: darkBackground,
	text: darkBackground,
}


const ThemeProvider = ({ children }: { children: JSX.Element }) => {
	const colorScheme: SettingsState['colorScheme'] = useSelector((state: RootState) => state.settings.colorScheme);
	const systemColorScheme = Appearance.getColorScheme();
	return <NativeBaseProvider theme={extendTheme({
		colors: colorScheme == 'dark'
			? darkTheme
			: colorScheme == 'light'
				? lightTheme
				: systemColorScheme == 'light'
					? lightTheme
					: darkTheme
	})}>
		{ children }
	</NativeBaseProvider>;
}

export default ThemeProvider;