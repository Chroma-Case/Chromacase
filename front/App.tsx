import Theme from './Theme';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import store from './state/Store';
import { Router } from './Navigation';
import './i18n/i18n';
import { NativeBaseProvider } from "native-base";

const queryClient = new QueryClient();

export default function App() {
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
