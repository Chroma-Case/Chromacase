import { Provider as PaperProvider } from 'react-native-paper';
import Theme from './Theme';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import store from './state/Store';
import { Router } from './Navigation';

const queryClient = new QueryClient();

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={Theme}>
          <Router/>
        </PaperProvider>
      </QueryClientProvider>
    </Provider>
  );
}
