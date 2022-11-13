import { NativeBaseProvider } from "native-base";
import Theme from './Theme';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import store from './state/Store';
import { Router } from './Navigation';
import './i18n/i18n';
import * as SplashScreen from 'expo-splash-screen';

const queryClient = new QueryClient();

export default function App() {

	SplashScreen.preventAutoHideAsync();
	setTimeout(SplashScreen.hideAsync, 2000);

	useEffect(() => {
		async function prepare() {
			try { await new Promise((resolve) => setTimeout(resolve, 2000)); }
			catch (e) { console.warn(e); }
		}
		prepare();
	}, []);

	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<NativeBaseProvider theme={Theme}>
					<Router />
				</NativeBaseProvider>
			</QueryClientProvider>
		</Provider>
	);
}
