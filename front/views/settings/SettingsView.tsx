import React from 'react';
import { Text, useBreakpointValue, useTheme } from 'native-base';
import ProfileSettings from './SettingsProfile';
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
	UserEdit,
	Notification,
	SecurityUser,
	FolderCross,
} from 'iconsax-react-native';
import { Scene } from 'react-native-tab-view/lib/typescript/src/types';
import { RouteProps } from '../../Navigation';
import ScaffoldCC from '../../components/UI/ScaffoldCC';
import { translate } from '../../i18n/i18n';

const renderScene = SceneMap({
	profile: ProfileSettings,
	preferences: PreferencesSettings,
	privacy: PrivacySettings,
});

const getTabData = (key: string) => {
	switch (key) {
		case 'profile':
			return { index: 0, icon: UserEdit };
		case 'preferences':
			return { index: 2, icon: HeartEdit };
		case 'notifications':
			return { index: 3, icon: Notification };
		case 'privacy':
			return { index: 4, icon: SecurityUser };
		default:
			return { index: 6, icon: FolderCross };
	}
};

// eslint-disable-next-line @typescript-eslint/ban-types
const SettingsTab = (props: RouteProps<{}>) => {
	const layout = useWindowDimensions();
	const [index, setIndex] = React.useState(0);
	const { colors } = useTheme();
	const routes = [
		{ key: 'profile', title: 'settingsTabProfile' },
		{ key: 'preferences', title: 'settingsTabPreferences' },
		{ key: 'privacy', title: 'settingsTabPrivacy' },
	];
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isSmallScreen = screenSize === 'small';
	const renderTabBar = (
		props: SceneRendererProps & { navigationState: NavigationState<Route> }
	) => (
		<TabBar
			{...props}
			style={{
				backgroundColor: 'transparent',
				borderBottomWidth: 1,
				borderColor: colors.primary[300],
			}}
			activeColor={colors.text[900]}
			inactiveColor={colors.text[700]}
			indicatorStyle={{ backgroundColor: colors.primary[300] }}
			renderIcon={(
				scene: Scene<Route> & {
					focused: boolean;
					color: string;
				}
			) => {
				const tabHeader = getTabData(scene.route!.key);
				return (
					<tabHeader.icon
						size="18"
						color="#6075F9"
						variant={scene.focused ? 'Bold' : 'Outline'}
					/>
				);
			}}
			renderLabel={({ route, color }) =>
				layout.width > 1100 && (
					<Text style={{ color: color, paddingLeft: 10, overflow: 'hidden' }}>
						{translate(
							route.title as
								| 'settingsTabProfile'
								| 'settingsTabPreferences'
								| 'settingsTabPrivacy'
						)}
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
					padding: isSmallScreen ? 8 : 20,
					maxWidth: 850,
					width: '100%',
				}}
				renderTabBar={renderTabBar}
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
			/>
		</ScaffoldCC>
	);
};

export default SettingsTab;
