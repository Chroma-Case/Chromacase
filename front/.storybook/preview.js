import { NativeBaseProvider } from "native-base";
import Theme from '../Theme';

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};
export const decorators = [
	(Story) => (
		<NativeBaseProvider theme={Theme}>
			<Story />
		</NativeBaseProvider>
	),
];
