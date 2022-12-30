import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from './state/Store';
import { translate } from './i18n/i18n';
import SongLobbyView from './views/SongLobbyView';
import AuthenticationView from './views/AuthenticationView';
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import SetttingsNavigator from './views/SettingsView';
import { useQuery } from 'react-query';
import API from './API';
import ProfileView from './views/ProfileView';

const Stack = createNativeStackNavigator();

export const protectedRoutes = <>
	<Stack.Screen name="Home" component={HomeView} options={{ title: translate('welcome') }} />
	<Stack.Screen name="Settings" component={SetttingsNavigator} options={{ title: 'Settings' }} />
	<Stack.Screen name="Song" component={SongLobbyView} options={{ title: translate('play') }} />
	<Stack.Screen name="Search" component={SearchView} options={{ title: translate('search') }} />
	<Stack.Screen name="User" component={ProfileView} options={{ title: translate('user') }} />
</>;

export const publicRoutes = <React.Fragment>
	<Stack.Screen name="Login" component={AuthenticationView} options={{ title: translate('signinBtn')}} />
</React.Fragment>;

export const Router = () => {
	const isAuthentified = useSelector((state) => state.user.accessToken !== undefined);
	const userProfile = useQuery(['user', 'me'], () => API.getUserInfo(), {
		enabled: isAuthentified
	});
	return (
		<NavigationContainer>
			{isAuthentified && !userProfile.isError
				? <Stack.Navigator>
					{protectedRoutes}
				</Stack.Navigator>
				: <Stack.Navigator>
					{publicRoutes}
				</Stack.Navigator>
			}
		</NavigationContainer>
	)
}
