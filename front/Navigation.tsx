import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AuthenticationView from './views/AuthenticationView';
import HomeView from './views/HomeView';
import SetttingsNavigator from './views/SettingsView';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();

export const protectedRoutes = <React.Fragment>
	<Stack.Screen name="Home" component={HomeView} options={{ title: 'Welcome' }} />
	<Stack.Screen name="Settings" component={SetttingsNavigator} options={{ title: 'Settings' }} />
</React.Fragment>;

export const publicRoutes = <React.Fragment>
	<Stack.Screen name="Login" component={AuthenticationView} options={{}} />
</React.Fragment>;

export const Router = () => {
	const isAuthentified = useSelector((state) => state.user.token !== undefined)
	return (
		<NavigationContainer>
			<Stack.Navigator>
				{isAuthentified ? protectedRoutes : publicRoutes}
			</Stack.Navigator>
		</NavigationContainer>
	)
}