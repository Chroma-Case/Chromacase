import { NativeBaseProvider } from "native-base";
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import store from './state/Store';
import { Router } from './Navigation';
import './i18n/i18n';
const queryClient = new QueryClient();

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider>
          <Router/>
        </NativeBaseProvider>
      </QueryClientProvider>
    </Provider>
  );
}
