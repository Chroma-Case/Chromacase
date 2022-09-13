/**
 * Color theme to use thoughout the application
 * Using the Material Color guidelines
 */

import { DefaultTheme } from 'react-native-paper';

const Theme = {
	...DefaultTheme,
	roundness: 10,
	colors: {
		...DefaultTheme.colors,
		primary: '#5db075',
		background: '#F0F0F0',
		surface: '#F6F6F6',
		accent: '#00bdbd',
		error: '#B00020',
		text: '#000000',
		onSurface: '#000000',
		placeholder: '#C9C9C9',
		notification: '#FF0000'
	}
};

export default Theme;