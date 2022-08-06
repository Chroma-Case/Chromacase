import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeView from './views/HomeView';

export const Stack = createNativeStackNavigator();

export const protectedRoutes = <React.Fragment>
	<Stack.Screen name="Home" component={HomeView} options={{ title: 'Welcome' }} />
</React.Fragment>;

export const publicRoutes = <React.Fragment>

</React.Fragment>;