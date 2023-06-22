/* eslint-disable @typescript-eslint/ban-types */
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import {
	NavigationProp,
	ParamListBase,
	useNavigation as navigationHook,
} from '@react-navigation/native';
import React, { useEffect, useMemo } from 'react';
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
import { useQuery } from './Queries';
import API, { APIError } from './API';
import PlayView from './views/PlayView';
import ScoreView from './views/ScoreView';
import { LoadingView } from './components/Loading';
import ProfileView from './views/ProfileView';
import useColorScheme from './hooks/colorScheme';
import ArtistDetailsView from './views/ArtistDetailsView';
import { Button, Center, VStack } from 'native-base';
import { unsetAccessToken } from './state/UserSlice';
import TextButton from './components/TextButton';
import ErrorView from './views/ErrorView';

const protectedRoutes = () =>
	({
		Home: {
			component: HomeView,
			options: { title: translate('welcome'), headerLeft: null },
			link: '/',
		},
		Play: { component: PlayView, options: { title: translate('play') }, link: '/play' },
		Settings: {
			component: SetttingsNavigator,
			options: { title: 'Settings' },
			link: '/settings/:screen?',
			stringify: {
				screen: () => '',
			},
		},
		Song: {
			component: SongLobbyView,
			options: { title: translate('play') },
			link: '/song/:songId',
		},
		Artist: {
			component: ArtistDetailsView,
			options: { title: translate('artistFilter') },
			link: '/artist/:artistId',
		},
		Score: {
			component: ScoreView,
			options: { title: translate('score'), headerLeft: null },
			link: undefined,
		},
		Search: {
			component: SearchView,
			options: { title: translate('search') },
			link: '/search/:query?',
		},
		Error: {
			component: ErrorView,
			options: { title: translate('error'), headerLeft: null },
			link: undefined,
		},
		User: { component: ProfileView, options: { title: translate('user') }, link: '/user' },
	} as const);

const publicRoutes = () =>
	({
		Start: {
			component: StartPageView,
			options: { title: 'Chromacase', headerShown: false },
			link: '/',
		},
		Login: {
			component: (params: RouteProps<{}>) =>
				AuthenticationView({ isSignup: false, ...params }),
			options: { title: translate('signInBtn') },
			link: '/login',
		},
		Signup: {
			component: (params: RouteProps<{}>) =>
				AuthenticationView({ isSignup: true, ...params }),
			options: { title: translate('signUpBtn') },
			link: '/signup',
		},
		Oops: {
			component: ProfileErrorView,
			options: { title: 'Oops', headerShown: false },
			link: undefined,
		},
	} as const);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Route<Props = any> = {
	component: (arg: RouteProps<Props>) => JSX.Element | (() => JSX.Element);
	options: object;
};

type OmitOrUndefined<T, K extends string> = T extends undefined ? T : Omit<T, K>;

type RouteParams<Routes extends Record<string, Route>> = {
	[RouteName in keyof Routes]: OmitOrUndefined<
		Parameters<Routes[RouteName]['component']>[0],
		keyof NativeStackScreenProps<{}>
	>;
};

type PrivateRoutesParams = RouteParams<ReturnType<typeof protectedRoutes>>;
type PublicRoutesParams = RouteParams<ReturnType<typeof publicRoutes>>;
type AppRouteParams = PrivateRoutesParams & PublicRoutesParams;

const Stack = createNativeStackNavigator<AppRouteParams & { Loading: never }>();

const RouteToScreen =
	<T extends {}>(component: Route<T>['component']) =>
	// eslint-disable-next-line react/display-name
	(props: NativeStackScreenProps<T & ParamListBase>) =>
		(
			<>
				{component({ ...props.route.params, route: props.route } as Parameters<
					Route<T>['component']
				>[0])}
			</>
		);

const routesToScreens = (routes: Partial<Record<keyof AppRouteParams, Route>>) =>
	Object.entries(routes).map(([name, route], routeIndex) => (
		<Stack.Screen
			key={'route-' + routeIndex}
			name={name as keyof AppRouteParams}
			options={route.options}
			component={RouteToScreen(route.component)}
		/>
	));

const routesToLinkingConfig = (
	routes: Partial<
		Record<keyof AppRouteParams, { link?: string; stringify?: Record<string, () => string> }>
	>
) => {
	// Too lazy to (find the) type
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const pagesToRoute = {} as Record<keyof AppRouteParams, any>;
	Object.keys(routes).forEach((route) => {
		const index = route as keyof AppRouteParams;
		if (routes[index]?.link) {
			pagesToRoute[index] = {
				path: routes[index]!.link!,
				stringify: routes[index]!.stringify,
			};
		}
	});
	return {
		prefixes: [],
		config: { screens: pagesToRoute },
	};
};

const ProfileErrorView = (props: { onTryAgain: () => void }) => {
	const dispatch = useDispatch();
	return (
		<Center style={{ flexGrow: 1 }}>
			<VStack space={3}>
				<Translate translationKey="userProfileFetchError" />
				<Button onPress={props.onTryAgain}>
					<Translate translationKey="tryAgain" />
				</Button>
				<TextButton
					onPress={() => dispatch(unsetAccessToken())}
					colorScheme="error"
					variant="outline"
					translate={{ translationKey: 'signOutBtn' }}
				/>
			</VStack>
		</Center>
	);
};

export const Router = () => {
	const dispatch = useDispatch();
	const accessToken = useSelector((state: RootState) => state.user.accessToken);
	const userProfile = useQuery(API.getUserInfo, {
		retry: 1,
		refetchOnWindowFocus: false,
		onError: (err) => {
			if (err instanceof APIError && err.status === 401) {
				dispatch(unsetAccessToken());
			}
		},
	});
	const colorScheme = useColorScheme();
	const authStatus = useMemo(() => {
		if (userProfile.isError && accessToken && !userProfile.isLoading) {
			return 'error';
		}
		if (userProfile.isLoading && !userProfile.data) {
			return 'loading';
		}
		if (userProfile.isSuccess && accessToken) {
			return 'authed';
		}
		return 'noAuth';
	}, [userProfile, accessToken]);
	const routes = useMemo(() => {
		if (authStatus == 'authed') {
			return protectedRoutes();
		}
		return publicRoutes();
	}, [authStatus]);

	useEffect(() => {
		if (accessToken) {
			userProfile.refetch();
		}
	}, [accessToken]);

	if (authStatus == 'loading') {
		// We dont want this to be a screen, as this lead to a navigator without the requested route, and fallback.
		return <LoadingView />;
	}

	return (
		<NavigationContainer
			linking={routesToLinkingConfig(routes)}
			fallback={<LoadingView />}
			theme={colorScheme == 'light' ? DefaultTheme : DarkTheme}
		>
			<Stack.Navigator>
				{authStatus == 'error' ? (
					<Stack.Screen
						name="Oops"
						component={RouteToScreen(() => (
							<ProfileErrorView onTryAgain={() => userProfile.refetch()} />
						))}
					/>
				) : (
					routesToScreens(routes)
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export type RouteProps<T> = T & Pick<NativeStackScreenProps<T & ParamListBase>, 'route'>;

export const useNavigation = () => navigationHook<NavigationProp<AppRouteParams>>();
