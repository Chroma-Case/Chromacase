import React from 'react';
import { Center, Flex, Text, useTheme } from 'native-base';
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
import { ColorSchemeProvider } from '../../Theme';
import useColorScheme from '../../hooks/colorScheme';
import { translate } from '../../i18n/i18n';

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
	const colorScheme = useColorScheme();
	const { colors } = useTheme();
	const [routes] = React.useState<Route[]>([
		{ key: 'profile', title: 'settingsTabProfile' },
		{ key: 'premium', title: 'settingsTabPremium' },
		{ key: 'preferences', title: 'settingsTabPreferences' },
		{ key: 'notifications', title: 'settingsTabNotifications' },
		{ key: 'privacy', title: 'settingsTabPrivacy' },
		{ key: 'piano', title: 'settingsTabPiano' },
	]);
	const renderTabBar = (
		props: SceneRendererProps & { navigationState: NavigationState<Route> }
	) => (
		<TabBar
			{...props}
			style={{
				backgroundColor: 'transparent',
				borderBottomWidth: 1,
				borderColor: colors.primary[500],
			}}
			activeColor={ colorScheme === 'light' ? '#000' : '#fff'}
			inactiveColor={ colorScheme === 'light' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'}
			indicatorStyle={{ backgroundColor: colors.primary[500] }}
			renderIcon={(
				scene: Scene<Route> & {
					focused: boolean;
					color: string;
				}
			) => {
				const tabHeader = getTabData(scene.route!.key);
				return (
					<tabHeader.icon size="18" color="#6075F9" variant={scene.focused ? "Bold" : "Outline"} />
				);
			}}
			renderLabel={({ route, color }) =>
				layout.width > 1100 && (
					<Text style={{ color: color, paddingLeft: 10, overflow: 'hidden' }}>
						{translate(route.title as 'settingsTabProfile' | 'settingsTabPremium' | 'settingsTabPreferences' | 'settingsTabNotifications' | 'settingsTabPrivacy' | 'settingsTabPiano')}
					</Text>
				)
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
