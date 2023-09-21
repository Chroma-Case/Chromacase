import React from 'react';
import { Center, Text } from 'native-base';
import ProfileSettings from './SettingsProfileView';
import NotificationsView from './NotificationView';
import PrivacyView from './PrivacyView';
import PreferencesView from './PreferencesView';
import { View, useWindowDimensions } from 'react-native';
import {
	TabView,
	SceneMap,
	TabBar,
	NavigationState,
	Route,
	SceneRendererProps,
} from 'react-native-tab-view';
import {
	HeartEdit,
	Star1,
	UserEdit,
	Notification,
	SecurityUser,
	Music,
	FolderCross,
} from 'iconsax-react-native';
import { Scene } from 'react-native-tab-view/lib/typescript/src/types';
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

const getTabData = (key: string) => {
	switch (key) {
		case 'profile':
			return { index: 0, icon: UserEdit };
		case 'premium':
			return { index: 1, icon: Star1 };
		case 'preferences':
			return { index: 2, icon: HeartEdit };
		case 'notifications':
			return { index: 3, icon: Notification };
		case 'privacy':
			return { index: 4, icon: SecurityUser };
		case 'piano':
			return { index: 5, icon: Music };
		default:
			return { index: 6, icon: FolderCross };
	}
};

const SetttingsNavigator = () => {
	const layout = useWindowDimensions();

	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState<Route[]>([
		{ key: 'profile', title: 'Profile' },
		{ key: 'premium', title: 'Premium' },
		{ key: 'preferences', title: 'Preferences' },
		{ key: 'notifications', title: 'Notifications' },
		{ key: 'privacy', title: 'Privacy' },
		{ key: 'piano', title: 'Piano' },
	]);

	const renderTabBar = (
		props: SceneRendererProps & { navigationState: NavigationState<Route> }
	) => (
		<TabBar
			{...props}
			style={{
				backgroundColor: 'rgba(0, 0, 0, 0)',
				borderBottomWidth: 2,
				borderColor: 'rgba(255,255,255,0.5)',
			}}
			indicatorStyle={{ backgroundColor: 'white' }}
			renderIcon={(
				scene: Scene<Route> & {
					focused: boolean;
					color: string;
				}
			) => {
				const tabHeader = getTabData(scene.route!.key);
				return tabHeader.index == index ? (
					<tabHeader.icon size="18" color="#6075F9" variant="Bold" />
				) : (
					<tabHeader.icon size="18" color="#6075F9" />
				);
			}}
			renderLabel={({ route, color }) =>
				layout.width > 750 ? (
					<Text style={{ color, paddingLeft: 10, overflow: 'hidden' }}>
						{route.title}
					</Text>
				) : null
			}
			tabStyle={{ flexDirection: 'row' }}
		/>
	);

	return (
		<View>
			<TabView
				style={{ minHeight: layout.height, height: '100%', paddingBottom: 32 }}
				renderTabBar={renderTabBar}
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
			/>
			<LinearGradient
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				colors={['#101014', '#6075F9']}
				style={{
					top: 0,
					bottom: 0,
					right: 0,
					left: 0,
					width: '100%',
					height: '100%',
					margin: 0,
					padding: 0,
					position: 'absolute',
					zIndex: -2,
				}}
			/>
		</View>
	);
};

export default SetttingsNavigator;
