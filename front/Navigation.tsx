/* eslint-disable @typescript-eslint/ban-types */
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
	NavigationProp,
	ParamListBase,
	useNavigation as navigationHook,
} from '@react-navigation/native';
import React, { ComponentProps, ComponentType, useEffect, useMemo } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { RootState, useSelector } from './state/Store';
import { useDispatch } from 'react-redux';
import { Translate, translate } from './i18n/i18n';
import SearchView from './views/V2/SearchView';
import SettingsTab from './views/settings/SettingsView';
import { useQuery } from './Queries';
import API, { APIError } from './API';
import PlayView from './views/PlayView';
import { LoadingView } from './components/Loading';
import ProfileView from './views/ProfileView';
import useColorScheme from './hooks/colorScheme';
import ArtistDetailsView from './views/ArtistDetailsView';
import { Button, Center, VStack } from 'native-base';
import { unsetAccessToken } from './state/UserSlice';
import TextButton from './components/TextButton';
import ErrorView from './views/ErrorView';
import GenreDetailsView from './views/GenreDetailsView';
import GoogleView from './views/GoogleView';
import VerifiedView from './views/VerifiedView';
import SigninView from './views/SigninView';
import SignupView from './views/SignupView';
import PasswordResetView from './views/PasswordResetView';
import ForgotPasswordView from './views/ForgotPasswordView';
import DiscoveryView from './views/V2/DiscoveryView';
import MusicView from './views/MusicView';
import Leaderboardiew from './views/LeaderboardView';
import { LinearGradient } from 'expo-linear-gradient';
import ScaffoldMobileCC from './components/UI/ScaffoldMobileCC';
import ScaffoldDesktopCC from './components/UI/ScaffoldDesktopCC';
import { createCustomNavigator } from './utils/navigator';
import { Cup, Discover, Music, SearchNormal1, Setting2, User } from 'iconsax-react-native';

const Stack = createNativeStackNavigator<AppRouteParams & { Loading: never; Oops: never }>();
const Tab = createCustomNavigator<AppRouteParams & { Loading: never; Oops: never }>();

const Tabs = () => {
	return (
		<Tab.Navigator>
			{Object.entries(tabRoutes).map(([name, route], routeIndex) => (
				<Tab.Screen
					key={'route-' + routeIndex}
					name={name}
					options={{ ...route.options, headerTransparent: true }}
					component={RouteToScreen(route.component)}
				/>
			))}
		</Tab.Navigator>
	);
};

// Util function to hide route props in URL
const removeMe = () => '';

const tabRoutes = {
	Home: {
		component: DiscoveryView,
		options: { headerShown: false, tabBarIcon: Discover },
		link: '/',
	},
	User: {
		component: ProfileView,
		options: { headerShown: false, tabBarIcon: User },
		link: '/user',
	},
	Music: {
		component: MusicView,
		options: { headerShown: false, tabBarIcon: Music },
		link: '/music',
	},
	Search: {
		component: SearchView,
		options: { headerShown: false, tabBarIcon: SearchNormal1 },
		link: '/search/:query?',
	},
	Leaderboard: {
		component: Leaderboardiew,
		options: { title: translate('leaderboardTitle'), headerShown: false, tabBarIcon: Cup },
		link: '/leaderboard',
	},
	Settings: {
		component: SettingsTab,
		options: { headerShown: false, tabBarIcon: Setting2, subMenu: true },
		link: '/settings/:screen?',
		stringify: {
			screen: removeMe,
		},
	},
};

const protectedRoutes = {
	Tabs: {
		component: Tabs,
		options: { headerShown: false, path: '' },
		link: '',
		childRoutes: tabRoutes,
	},
	Play: {
		component: PlayView,
		options: { headerShown: false, title: translate('play') },
		link: '/play/:songId',
	},
	Artist: {
		component: ArtistDetailsView,
		options: { title: translate('artistFilter') },
		link: '/artist/:artistId',
	},
	Genre: {
		component: GenreDetailsView,
		options: { title: translate('genreFilter') },
		link: '/genre/:genreId',
	},
	Error: {
		component: ErrorView,
		options: { title: translate('error'), headerLeft: null },
		link: undefined,
	},
	Verified: {
		component: VerifiedView,
		options: { title: 'Verify email', headerShown: false },
		link: '/verify',
	},
};

const publicRoutes = {
	Login: {
		component: SigninView,
		options: { title: translate('signInBtn'), headerShown: false },
		link: '/login',
	},
	Signup: {
		component: SignupView,
		options: { title: translate('signUpBtn'), headerShown: false },
		link: '/signup',
	},
	Google: {
		component: GoogleView,
		options: { title: 'Google signin', headerShown: false },
		link: '/logged/google',
	},
	PasswordReset: {
		component: PasswordResetView,
		options: { title: 'Password reset form', headerShown: false },
		link: '/password_reset',
	},
	ForgotPassword: {
		component: ForgotPasswordView,
		options: { title: 'Password reset form', headerShown: false },
		link: '/forgot_password',
	},
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Route<Props = any> = {
	component: ComponentType<Props>;
	options: object;
	link?: string;
};

type OmitOrUndefined<T, K extends string> = T extends undefined ? T : Omit<T, K>;

type RouteParams<Routes extends Record<string, Route>> = {
	[RouteName in keyof Routes]: OmitOrUndefined<
		ComponentProps<Routes[RouteName]['component']>,
		keyof NativeStackScreenProps<{}>
	>;
};

type PrivateRoutesParams = RouteParams<typeof protectedRoutes>;
type PublicRoutesParams = RouteParams<typeof publicRoutes>;
type AppRouteParams = PrivateRoutesParams & PublicRoutesParams;

const RouteToScreen = <T extends {}>(Component: Route<T>['component']) =>
	function Route(props: NativeStackScreenProps<T & ParamListBase>) {
		const colorScheme = useColorScheme();

		return (
			<LinearGradient
				colors={colorScheme === 'dark' ? ['#101014', '#6075F9'] : ['#cdd4fd', '#cdd4fd']}
				style={{
					flex: 1,
				}}
			>
				<Component {...(props.route.params as T)} route={props.route} />
			</LinearGradient>
		);
	};

const routesToScreens = (routes: Partial<Record<keyof AppRouteParams, Route>>) =>
	Object.entries(routes).map(([name, route], routeIndex) => (
		<Stack.Screen
			key={'route-' + routeIndex}
			name={name as keyof AppRouteParams}
			options={{ ...route.options, headerTransparent: true }}
			component={RouteToScreen(route.component)}
		/>
	));

type RouteDescription = Record<
	string,
	{ link?: string; stringify?: Record<string, () => string>; childRoutes?: RouteDescription }
>;

const routesToLinkingConfig = (routes: RouteDescription) => {
	// Too lazy to (find the) type
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const pagesToRoute = {} as Record<keyof AppRouteParams, any>;
	Object.keys(routes).forEach((route) => {
		const index = route as keyof AppRouteParams;
		if (routes[index]?.link !== undefined) {
			pagesToRoute[index] = {
				path: routes[index]!.link!,
				stringify: routes[index]!.stringify,
				screens: routes[index]!.childRoutes
					? routesToLinkingConfig(routes[index]!.childRoutes!).config.screens
					: undefined,
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
	const navigation = useNavigation();

	return (
		<Center style={{ flexGrow: 1 }}>
			<VStack space={3}>
				<Translate translationKey="userProfileFetchError" />
				<Button onPress={props.onTryAgain}>
					<Translate translationKey="tryAgain" />
				</Button>
				<TextButton
					onPress={() => {
						dispatch(unsetAccessToken());
						navigation.navigate('Login');
					}}
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

	useEffect(() => {
		if (accessToken) {
			userProfile.refetch();
		}
	}, [accessToken]);

	if (authStatus == 'loading') {
		// We dont want this to be a screen, as this lead to a navigator without the requested route, and fallback.
		return <LoadingView />;
	}

	const routes = authStatus == 'authed' ? { ...protectedRoutes } : publicRoutes;
	return (
		<NavigationContainer
			linking={routesToLinkingConfig(routes)}
			fallback={<LoadingView />}
			theme={colorScheme == 'light' ? DefaultTheme : DarkTheme}
		>
			<Stack.Navigator>
				{authStatus == 'error' ? (
					<>
						<Stack.Screen
							name="Oops"
							component={RouteToScreen(() => (
								<ProfileErrorView onTryAgain={() => userProfile.refetch()} />
							))}
						/>
						{routesToScreens(publicRoutes)}
					</>
				) : (
					routesToScreens(routes)
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export type RouteProps<T> = T & Pick<NativeStackScreenProps<T & ParamListBase>, 'route'>;

export const useNavigation = () => navigationHook<NavigationProp<AppRouteParams>>();
