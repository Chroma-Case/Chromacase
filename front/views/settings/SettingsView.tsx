import React, { useMemo } from 'react';
import { Center, Text, Heading, Box, Row } from 'native-base';
import { translate } from '../../i18n/i18n';
import createTabRowNavigator from '../../components/navigators/TabRowNavigator';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import ChangePasswordForm from '../../components/forms/changePasswordForm';
import ChangeEmailForm from '../../components/forms/changeEmailForm';
import ProfileSettings from './SettingsProfileView';
import NotificationsView from './NotificationView';
import PrivacyView from './PrivacyView';
import PreferencesView from './PreferencesView';
import GuestToUserView from './GuestToUserView';
import { useQuery } from '../../Queries';
import API from '../../API';
import { RouteProps } from '../../Navigation';
import { PressableAndroidRippleConfig, StyleProp, TextStyle, View, ViewStyle, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar, NavigationState, Route, SceneRendererProps, TabBarIndicatorProps, TabBarItemProps } from 'react-native-tab-view';
import { HeartEdit, Star1, UserEdit, Notification, SecurityUser, Music, Icon } from 'iconsax-react-native';
import { Scene, Event } from 'react-native-tab-view/lib/typescript/src/types';
import { LinearGradient } from 'expo-linear-gradient';
import PremiumSettings from './SettingsPremiumView';

export const PianoSettingsView = () => {
	return (
		<Center style={{ flex: 1 }}>
			<Text>Global settings for the virtual piano</Text>
		</Center>
	);
};

const renderScene = SceneMap({
	profile: ProfileSettings,
	premium: PremiumSettings,
	preferences: PreferencesView,
	notifications: NotificationsView,
	privacy: PrivacyView,
	piano: PianoSettingsView,
});

const SetttingsNavigator = () => {
	const layout = useWindowDimensions();

	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{index: 0, key: 'profile', title: 'Profile', icon: UserEdit},
		{index: 1, key: 'premium', title: 'Premium', icon: Star1},
		{index: 2, key: 'preferences', title: 'Preferences', icon: HeartEdit},
		{index: 3, key: 'notifications', title: 'Notifications', icon: Notification},
		{index: 4, key: 'privacy', title: 'Privacy', icon: SecurityUser},
		{index: 5, key: 'piano', title: 'Piano', icon: Music},
	]);

	const renderTabBar = (props: JSX.IntrinsicAttributes & SceneRendererProps & { navigationState: NavigationState<Route>; scrollEnabled?: boolean | undefined; bounces?: boolean | undefined; activeColor?: string | undefined; inactiveColor?: string | undefined; pressColor?: string | undefined; pressOpacity?: number | undefined; getLabelText?: ((scene: Scene<Route>) => string | undefined) | undefined; getAccessible?: ((scene: Scene<Route>) => boolean | undefined) | undefined; getAccessibilityLabel?: ((scene: Scene<Route>) => string | undefined) | undefined; getTestID?: ((scene: Scene<Route>) => string | undefined) | undefined; renderLabel?: ((scene: Scene<Route> & { focused: boolean; color: string; }) => React.ReactNode) | undefined; renderIcon?: ((scene: Scene<Route> & { focused: boolean; color: string; }) => React.ReactNode) | undefined; renderBadge?: ((scene: Scene<Route>) => React.ReactNode) | undefined; renderIndicator?: ((props: TabBarIndicatorProps<Route>) => React.ReactNode) | undefined; renderTabBarItem?: ((props: TabBarItemProps<Route> & { key: string; }) => React.ReactElement<any, string | React.JSXElementConstructor<any>>) | undefined; onTabPress?: ((scene: Scene<Route> & Event) => void) | undefined; onTabLongPress?: ((scene: Scene<Route>) => void) | undefined; tabStyle?: StyleProp<ViewStyle>; indicatorStyle?: StyleProp<ViewStyle>; indicatorContainerStyle?: StyleProp<ViewStyle>; labelStyle?: StyleProp<TextStyle>; contentContainerStyle?: StyleProp<ViewStyle>; style?: StyleProp<ViewStyle>; gap?: number | undefined; testID?: string | undefined; android_ripple?: PressableAndroidRippleConfig | undefined; }) => (
		<TabBar
		  {...props}
			style={{backgroundColor: 'rgba(0, 0, 0, 0)', borderBottomWidth: 2, borderColor: 'rgba(255,255,255,0.5)'}}
			indicatorStyle={{ backgroundColor: 'white' }}
			renderIcon={(scene: Scene<Route> & {
				focused: boolean;
				color: string;
			}) => {
				const MyIcon: Icon = scene.route?.icon as unknown as Icon;
				return scene.route?.index == index ?
					<MyIcon size="18" color="#6075F9" variant='Bold'/>
					: <MyIcon size="18" color="#6075F9"/>
			}}
			renderLabel={({ route, focused, color }) => (
				layout.width > 750 ?
				<Text style={{color, paddingLeft: 10, overflow: 'hidden'}}>
					{route.title}
				</Text> : null
			)}	
			tabStyle={{flexDirection: 'row'}}
			/>
	  );

	return (
		<View>
			<TabView
			style={{minHeight: layout.height, height: '100%', paddingBottom: 32}}
			renderTabBar={renderTabBar}
			navigationState={{ index, routes }}
			renderScene={renderScene}
			onIndexChange={setIndex}
			initialLayout={{ width: layout.width }}
			/>
			<LinearGradient
				start={{x: 0, y: 0}}
				end={{x: 1, y: 1}}
				colors={['#101014', '#6075F9']}
				style={{top: 0, bottom: 0, right: 0, left: 0, width: '100%', height: '100%', margin: 0, padding: 0,  position: 'absolute', zIndex: -2}}
			/>
		</View>
	);
};

export default SetttingsNavigator;
