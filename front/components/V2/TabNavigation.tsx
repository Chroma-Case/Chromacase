import { useBreakpointValue } from 'native-base';
import { View } from 'react-native';
import TabNavigationDesktop from './TabNavigationDesktop';
import TabNavigationPhone from './TabNavigationPhone';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import useColorScheme from '../../hooks/colorScheme';
import HomeView from '../../views/V2/HomeView';

export type NaviTab = {
	id: string;
	label: string;
	icon?: React.ReactNode;
	onPress?: () => void;
	onLongPress?: () => void;
	isActive?: boolean;
	isCollapsed?: boolean;
	iconName?: string;
};

const tabs = [
	{
		id: 'home',
		label: 'Discovery',
		icon: <Ionicons name="search" size={24} color="black" />,
		iconName: 'search',
	},
	{
		id: 'profile',
		label: 'Profile',
		icon: <Ionicons name="person" size={24} color="black" />,
		iconName: 'person',
	},
	{
		id: 'music',
		label: 'Music',
		icon: <Ionicons name="musical-notes" size={24} color="black" />,
		iconName: 'musical-notes',
	},
	{
		id: 'search',
		label: 'Search',
		icon: <Ionicons name="search" size={24} color="black" />,
		iconName: 'search',
	},
	{
		id: 'leaderboard',
		label: 'Leaderboard',
		icon: <Ionicons name="medal" size={24} color="black" />,
		iconName: 'medal',
	},
	{
		id: 'notifications',
		label: 'Notifications',
		icon: <Ionicons name="notifications" size={24} color="black" />,
		iconName: 'notifications',
	},
	{
		id: 'settings',
		label: 'Settings',
		icon: <Ionicons name="settings" size={24} color="white" />,
		iconName: 'settings',
	},
] as NaviTab[];

const TabNavigation = () => {
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
	const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? 'home');
	const colorScheme = useColorScheme();

	const child = <HomeView />;

	const appTabs = tabs.map((t) => {
		// use the same instance of a component between desktop and mobile
		return {
			...t,
			onPress: () => setActiveTab(t.id),
			icon: (
				<Ionicons
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					name={t.iconName as any}
					size={24}
					color={colorScheme === 'dark' ? 'white' : 'black'}
				/>
			),
		};
	});

	return (
		<View
			style={{
				width: '100%',
				height: '100%',
				backgroundColor: 'rgb(26, 36, 74)',
			}}
		>
			{screenSize === 'small' ? (
				<TabNavigationPhone
					tabs={appTabs}
					activeTabID={activeTab}
					setActiveTabID={setActiveTab}
				>
					<View
						// @ts-expect-error Raw CSS
						style={{
							width: 'calc(100% - 5)',
							height: '100%',
							backgroundColor: 'rgba(16, 16, 20, 0.50)',
							borderRadius: 12,
							margin: 5,
							backDropFilter: 'blur(2px)',
							padding: 15,
						}}
					>
						{child}
					</View>
				</TabNavigationPhone>
			) : (
				<TabNavigationDesktop
					tabs={appTabs}
					activeTabID={activeTab}
					setActiveTabID={setActiveTab}
					isCollapsed={isDesktopCollapsed}
					setIsCollapsed={setIsDesktopCollapsed}
				>
					<View
						// @ts-expect-error Raw CSS
						style={{
							width: 'calc(100% - 10)',
							height: '100%',
							backgroundColor: 'rgba(16, 16, 20, 0.50)',
							borderRadius: 12,
							marginVertical: 10,
							marginRight: 10,
							backDropFilter: 'blur(2px)',
							padding: 20,
						}}
					>
						{child}
					</View>
				</TabNavigationDesktop>
			)}
		</View>
	);
};

export default TabNavigation;
