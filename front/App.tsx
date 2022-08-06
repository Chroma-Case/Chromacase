import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import Theme from './Theme';
import { Stack, protectedRoutes, publicRoutes } from './Navigation';

const isAuthentified = true;

export default function App() {
  return (
    <PaperProvider theme={Theme}>
      <NavigationContainer>
        <Stack.Navigator>
          { isAuthentified ? protectedRoutes : publicRoutes }
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
