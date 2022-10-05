import { NativeBaseProvider } from "native-base";
import Theme from './Theme';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import store from './state/Store';
import { Router } from './Navigation';
import { Text, View } from "react-native";
import { NativeBaseProvider } from "native-base";

import './i18n/i18n';

const queryClient = new QueryClient();

export default function App() {
<<<<<<< HEAD
	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<NativeBaseProvider theme={Theme}>
					<Router />
				</NativeBaseProvider>
			</QueryClientProvider>
		</Provider>
	);
=======
  const inset = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  };
  
  return (
    <Provider store={store}>
      <NativeBaseProvider initialWindowMetrics={inset}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={Theme}>
          <Router/>
        </PaperProvider>
      </QueryClientProvider>
      </NativeBaseProvider>
    </Provider>
  );
>>>>>>> 1caa2eb (react native base form control working great removed formik)
}
