import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootState, useSelector } from './state/Store';
import { translate } from './i18n/i18n';
import SongLobbyView from './views/SongLobbyView';
import AuthenticationView from './views/AuthenticationView';
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import SetttingsNavigator from './views/SettingsView';
import { useQuery } from 'react-query';
import API from './API';
import PlayView from './views/PlayView';
import ScoreView from './views/ScoreView';
import { Center } from 'native-base';
import LoadingComponent from './components/Loading';
import ProfileView from './views/ProfileView';

const Stack = createNativeStackNavigator();

export const protectedRoutes = <>
	<Stack.Screen name="Home" component={HomeView} options={{ title: translate('welcome') }} />
	<Stack.Screen name="Settings" component={SetttingsNavigator} options={{ title: 'Settings' }} />
	<Stack.Screen name="Song" component={SongLobbyView} options={{ title: translate('play') }} />
	<Stack.Screen name="Play" component={() => PlayView({ songId: 1 })} options={{ title: translate('play') }} />
	<Stack.Screen name="Score" component={ScoreView} options={{ title: translate('score') }} />
	<Stack.Screen name="Search" component={SearchView} options={{ title: translate('search') }} />
	<Stack.Screen name="User" component={ProfileView} options={{ title: translate('user') }} />
</>;

export const publicRoutes = <React.Fragment>
	<Stack.Screen name="Login" component={AuthenticationView} options={{ title: translate('signinBtn')}} />
</React.Fragment>;

export const Router = () => {
	const accessToken = useSelector((state: RootState) => state.user.accessToken);
	const userProfile = useQuery(['user', 'me', accessToken], () => API.getUserInfo(), {
		retry: 1,
		refetchOnWindowFocus: false
	});

	if (userProfile.isLoading && !userProfile.data) {
		return <Center style={{ flexGrow: 1 }}>
			<LoadingComponent/>
		</Center>
	}
	return (
		<NavigationContainer>
			<Stack.Navigator>
			{ userProfile.isSuccess && accessToken
				? protectedRoutes
				: publicRoutes
			}
			</Stack.Navigator>
		</NavigationContainer>
	)
}
