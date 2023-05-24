import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationProp, ParamListBase, useNavigation as navigationHook } from "@react-navigation/native";
import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { RootState, useSelector } from './state/Store';
import { useDispatch } from 'react-redux';
import { Translate, translate } from './i18n/i18n';
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
import { LoadingView } from './components/Loading';
import ProfileView from './views/ProfileView';
import useColorScheme from './hooks/colorScheme';
import ArtistDetailsView from './views/ArtistDetailsView';
import { Button, Center, VStack } from 'native-base';
import { unsetAccessToken } from './state/UserSlice';
import TextButton from './components/TextButton';


const protectedRoutes = () => ({
	Home: { component: HomeView, options: { title: translate('welcome'), headerLeft: null } },
	Play: { component: PlayView, options: { title: translate('play') } },
	Settings: { component: SetttingsNavigator, options: { title: 'Settings' } },
	Song: { component: SongLobbyView, options: { title: translate('play') } },
	Play: { component: PlayView, options: { title: translate('play') } },
	Artist: { component: ArtistDetailsView, options: { title: translate('artistFilter') } },
	Score: { component: ScoreView, options: { title: translate('score'), headerLeft: null } },
	Search: { component: SearchView, options: { title: translate('search') } },
	User: { component: ProfileView, options: { title: translate('user') } },
}) as const;

const publicRoutes = () => ({
	Start: { component: StartPageView, options: { title: "Chromacase", headerShown: false } },
	Login: { component: AuthenticationView, options: { title: translate('signInBtn') } },
	Oops: { component: ProfileErrorView, options: { title: 'Oops', headerShown: false } },
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
	.map(([name, route], routeIndex) => (
		<Stack.Screen
			key={'route-' + routeIndex}
			name={name as keyof AppRouteParams}
			options={route.options}
			component={RouteToScreen(route.component)}
		/>
	))

const ProfileErrorView = (props: { onTryAgain: () => any }) => {
	const dispatch = useDispatch();
	return <Center style={{ flexGrow: 1 }}>
		<VStack space={3}>
			<Translate translationKey='userProfileFetchError'/>
			<Button onPress={props.onTryAgain}><Translate translationKey='tryAgain'/></Button>
			<TextButton onPress={() => dispatch(unsetAccessToken())}
				colorScheme="error" variant='outline'
				translate={{ translationKey: 'signOutBtn' }}
			/>
		</VStack>
	</Center>
}

export const Router = () => {
	const dispatch = useDispatch();
	const accessToken = useSelector((state: RootState) => state.user.accessToken);
	const userProfile = useQuery(['user', 'me', accessToken], () => API.getUserInfo(), {
		retry: 1,
		refetchOnWindowFocus: false,
		onError: (err) => {
			if (err.status === 401) {
				dispatch(unsetAccessToken());
			}
		},
	});
	const colorScheme = useColorScheme();

	useEffect(() => {
		if (accessToken) {
			userProfile.refetch();
		}
	}, [accessToken]);

	return (
		<NavigationContainer theme={colorScheme == 'light'
			? DefaultTheme
			: DarkTheme
		}>
			<Stack.Navigator>
				{ userProfile.isError && accessToken && !userProfile.isLoading
					? <Stack.Screen name="Oops" component={RouteToScreen(() => <ProfileErrorView onTryAgain={() => userProfile.refetch()}/>)}/>
					: userProfile.isLoading && !userProfile.data ?
						<Stack.Screen name="Loading" component={RouteToScreen(LoadingView)}/>
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