import { useBreakpointValue } from 'native-base';
import { View } from 'react-native';
import TabNavigationDesktop from './TabNavigationDesktop';
import TabNavigationPhone from './TabNavigationPhone';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import useColorScheme from '../../hooks/colorScheme';
import HomeView from '../../views/V2/DiscoveryView';

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

