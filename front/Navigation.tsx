import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AuthenticationView from './views/AuthenticationView';
import HomeView from './views/HomeView';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import SongLobbyView from './views/SongLobbyView';

const Stack = createNativeStackNavigator();

export const protectedRoutes = <>
	<Stack.Screen name="Home" component={HomeView} options={{ title: 'Welcome' }} />
	<Stack.Screen name="Song" component={SongLobbyView} options={{ title: 'Play' }} />
</>;

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