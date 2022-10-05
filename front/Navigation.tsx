import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AuthenticationView from './views/AuthenticationView';
import HomeView from './views/HomeView';
import SetttingsNavigator from './views/SettingsView';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from './state/Store';
import SongLobbyView from './views/SongLobbyView';
import { translate } from './i18n/i18n';
import LoginForm from "./components/forms/loginform";


const Stack = createNativeStackNavigator();

export const protectedRoutes = <>
	<Stack.Screen name="Home" component={HomeView} options={{ title: translate('welcome') }} />
	<Stack.Screen name="Settings" component={SetttingsNavigator} options={{ title: 'Settings' }} />
	<Stack.Screen name="Song" component={SongLobbyView} options={{ title: translate('play') }} />
</>;

export const publicRoutes = <React.Fragment>
	<Stack.Screen name="Login" component={AuthenticationView} options={{ title: translate('signinBtn')}} />
</React.Fragment>;

export const Router = () => {
	const isAuthentified = useSelector((state) => state.user.token !== undefined)
	return (
		<LoginForm />
	);
	return (
		<NavigationContainer>
			<Stack.Navigator>
				{isAuthentified ? protectedRoutes : publicRoutes}
			</Stack.Navigator>
		</NavigationContainer>
	)
}
// //