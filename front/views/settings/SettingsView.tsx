import React from 'react';
import { Center, Flex, Text } from 'native-base';
import ProfileSettings from './SettingsProfile';
import NotificationsSettings from './NotificationsSettings';
import PrivacySettings from './PrivacySettings';
import PreferencesSettings from './PreferencesSettings';
import { useWindowDimensions } from 'react-native';
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
import PremiumSettings from './SettingsPremium';
import { RouteProps } from '../../Navigation';
import ScaffoldCC from '../../components/UI/ScaffoldCC';

export const PianoSettings = () => {
	return (
		<Center style={{ flex: 1 }}>
			<Text>Global settings for the virtual piano</Text>
		</Center>
	);
};

const renderScene = SceneMap({
	profile: ProfileSettings,
	premium: PremiumSettings,
	preferences: PreferencesSettings,
	notifications: NotificationsSettings,
	privacy: PrivacySettings,
	piano: PianoSettings,
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

const SetttingsNavigator = (props: RouteProps<{}>) => {
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
				layout.width > 1100 ? (
					<Text style={{ color, paddingLeft: 10, overflow: 'hidden' }}>
						{route.title}
					</Text>
				) : null
			}
			tabStyle={{ flexDirection: 'row' }}
		/>
	);

	return (
		<ScaffoldCC routeName={props.route.name} withPadding={false}>
			<TabView
				sceneContainerStyle={{
					flex: 1,
					alignSelf: 'center',
					paddingTop: 32,
					padding: 20,
					maxWidth: 850,
					width: '100%'
				}}
				style={{ height: 'fit-content' }}
				renderTabBar={renderTabBar}
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
			/>
		</ScaffoldCC>
	);
};

export default SetttingsNavigator;
