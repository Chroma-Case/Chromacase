import { useBreakpointValue } from 'native-base';
import { View } from 'react-native';
import TabNavigationDesktop from './TabNavigationDesktop';
import TabNavigationPhone from './TabNavigationPhone';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/Store';
import useColorScheme from '../../hooks/colorScheme';

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

	const appTabs = tabs.map((t) => {
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
				/>
			) : (
				<TabNavigationDesktop
					tabs={appTabs}
					activeTabID={activeTab}
					setActiveTabID={setActiveTab}
					isCollapsed={isDesktopCollapsed}
					setIsCollapsed={setIsDesktopCollapsed}
				/>
			)}
		</View>
	);
};

export default TabNavigation;
