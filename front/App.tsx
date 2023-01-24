import { NativeBaseProvider, Box } from "native-base";
import Theme from "./Theme";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import store, { persistor } from "./state/Store";
import { Router } from "./Navigation";
import "./i18n/i18n";
import * as SplashScreen from "expo-splash-screen";
import { PersistGate } from "redux-persist/integration/react";
import LanguageGate from "./i18n/LanguageGate";
import SlideView from "./components/PartitionVisualizer/SlideView";

const queryClient = new QueryClient();

export default function App() {
	SplashScreen.preventAutoHideAsync();
	setTimeout(SplashScreen.hideAsync, 500);

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<QueryClientProvider client={queryClient}>
					<NativeBaseProvider theme={Theme}>
						<Box maxWidth={1000} paddingLeft={50}>
						<SlideView
							sources={[
								["https://i.picsum.photos/id/950/200/300.jpg?hmac=EEKbkKLpjWodOy9F68WA1hJkukq9UBUCIREC8fDW44U", 500, 200],
								["https://i.picsum.photos/id/950/200/300.jpg?hmac=EEKbkKLpjWodOy9F68WA1hJkukq9UBUCIREC8fDW44U", 200, 200],
								["https://i.picsum.photos/id/950/200/300.jpg?hmac=EEKbkKLpjWodOy9F68WA1hJkukq9UBUCIREC8fDW44U", 1000, 200]
							]}
							speed={200}
							startAt={0.2}
						/>
						</Box>
					</NativeBaseProvider>
				</QueryClientProvider>
			</PersistGate>
		</Provider>
	);
}
/*
<LanguageGate>
							<Router/>
						</LanguageGate>
						*/
