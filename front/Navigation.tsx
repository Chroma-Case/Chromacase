import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationProp, ParamListBase, useNavigation as navigationHook } from "@react-navigation/native";
import React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { RootState, useSelector } from './state/Store';
import { translate } from './i18n/i18n';
import SongLobbyView from './views/SongLobbyView';
import AuthenticationView from './views/AuthenticationView';
import StartPageView from './views/StartPageView';
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import SetttingsNavigator from './views/settings/SettingsView';
import { useQuery } from 'react-query';
import API from './API';
import PlayView from './views/PlayView';
import ScoreView from './views/ScoreView';
import { Center } from 'native-base';
import LoadingComponent from './components/Loading';
import ProfileView from './views/ProfileView';
import useColorScheme from './hooks/colorScheme';
import ArtistDetailsView from './views/ArtistDetailsView';


const protectedRoutes = () => ({
	Home: { component: HomeView, options: { title: translate('welcome') } },
	Settings: { component: SetttingsNavigator, options: { title: 'Settings' } },
	Song: { component: SongLobbyView, options: { title: translate('play') } },
	Play: { component: PlayView, options: { title: translate('play') } },
	Artist: { component: ArtistDetailsView, options: { title: translate('artist') } },
	Score: { component: ScoreView, options: { title: translate('score') } },
	Search: { component: SearchView, options: { title: translate('search') } },
	User: { component: ProfileView, options: { title: translate('user') } },
}) as const;

const publicRoutes = () => ({
	Start: { component: StartPageView, options: { title: "Chromacase", headerShown: false } },
	Login: { component: AuthenticationView, options: { title: translate('signInBtn') } },
}) as const;

type Route<Props = any> = {
	component: (arg: RouteProps<Props>) => JSX.Element | (() => JSX.Element),
	options: any
}

type OmitOrUndefined<T, K extends string> = T extends undefined ? T : Omit<T, K>

type RouteParams<Routes extends Record<string, Route>> = {
	[RouteName in keyof Routes]: OmitOrUndefined<Parameters<Routes[RouteName]['component']>[0], keyof NativeStackScreenProps<{}>>;
}

type PrivateRoutesParams = RouteParams<ReturnType<typeof protectedRoutes>>;
type PublicRoutesParams = RouteParams<ReturnType<typeof publicRoutes>>;
type AppRouteParams = PrivateRoutesParams & PublicRoutesParams;

const Stack = createNativeStackNavigator<AppRouteParams & { Loading: never }>();

const RouteToScreen = <T extends {}, >(component: Route<T>['component']) => (props: NativeStackScreenProps<T & ParamListBase>) =>
	<>
		{component({ ...props.route.params, route: props.route } as Parameters<Route<T>['component']>[0])}
	</>

const routesToScreens = (routes: Partial<Record<keyof AppRouteParams, Route>>) => Object.entries(routes)
	.map(([name, route]) => (
		<Stack.Screen
			name={name as keyof AppRouteParams}
			options={route.options}
			component={RouteToScreen(route.component)}
		/>
	))

export const Router = () => {
	const accessToken = useSelector((state: RootState) => state.user.accessToken);
	const userProfile = useQuery(['user', 'me', accessToken], () => API.getUserInfo(), {
		retry: 1,
		refetchOnWindowFocus: false
	});
	const colorScheme = useColorScheme();

	return (
		<NavigationContainer theme={colorScheme == 'light'
			? DefaultTheme
			: DarkTheme
		}>
			<Stack.Navigator>
				{ userProfile.isLoading && !userProfile.data ?
					<Stack.Screen name="Loading" component={() =>
						<Center style={{ flexGrow: 1 }}>
							<LoadingComponent/>
						</Center>
					}/>
					: routesToScreens(userProfile.isSuccess && accessToken
						? protectedRoutes()
						: publicRoutes())
				}
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export type RouteProps<T> = T & Pick<NativeStackScreenProps<T & ParamListBase>, 'route'>;


export const useNavigation = () => navigationHook<NavigationProp<AppRouteParams>>();