import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import store, { persistor } from './state/Store';
import { Router } from './Navigation';
import './i18n/i18n';
import * as SplashScreen from 'expo-splash-screen';
import { PersistGate } from 'redux-persist/integration/react';
import LanguageGate from './i18n/LanguageGate';
import ThemeProvider, { ColorSchemeProvider } from './Theme';
import 'react-native-url-polyfill/auto';
import { QueryRules } from './Queries';
import { useFonts } from 'expo-font';

const queryClient = new QueryClient(QueryRules);

export default function App() {
	// SplashScreen.preventAutoHideAsync();
	// setTimeout(SplashScreen.hideAsync, 500);

	SplashScreen.preventAutoHideAsync();

	const [fontsLoaded] = useFonts({
	'Lexend': require('./assets/fonts/Lexend-VariableFont_wght.ttf'),
	});

	useEffect(() => {
	if (fontsLoaded) {
		SplashScreen.hideAsync();
	}
	}, [fontsLoaded]);

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider>
						<ColorSchemeProvider>
							<LanguageGate>
								<Router />
							</LanguageGate>
						</ColorSchemeProvider>
					</ThemeProvider>
				</QueryClientProvider>
			</PersistGate>
		</Provider>
	);
}
