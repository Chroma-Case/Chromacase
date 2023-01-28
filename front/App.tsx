import { NativeBaseProvider } from "native-base";
import Theme from './Theme';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import store, { persistor } from './state/Store';
import { Router } from './Navigation';
import './i18n/i18n';
import * as SplashScreen from 'expo-splash-screen';
import { PersistGate } from "redux-persist/integration/react";
import LanguageGate from "./i18n/LanguageGate";

const queryClient = new QueryClient();

export default function App() {

	SplashScreen.preventAutoHideAsync();
	setTimeout(SplashScreen.hideAsync, 500);

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<QueryClientProvider client={queryClient}>
					<NativeBaseProvider theme={Theme}>
						<LanguageGate>
							<Router/>
						</LanguageGate>
					</NativeBaseProvider>
				</QueryClientProvider>
			</PersistGate>
		</Provider>
	);
}
