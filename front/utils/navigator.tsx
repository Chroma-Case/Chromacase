import {
	createNavigatorFactory,
	type DefaultNavigatorOptions,
	type ParamListBase,
	type TabActionHelpers,
	type TabNavigationState,
	TabRouter,
	type TabRouterOptions,
	useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';

import type { BottomTabNavigationConfig } from '@react-navigation/bottom-tabs/src/types';
import type {
	BottomTabNavigationEventMap,
	BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { BottomTabView } from '@react-navigation/bottom-tabs';

import ScaffoldMobileCC from '../components/UI/ScaffoldMobileCC';
import { useBreakpointValue } from 'native-base';
import ScaffoldDesktopCC from '../components/UI/ScaffoldDesktopCC';

type Props = DefaultNavigatorOptions<
	ParamListBase,
	TabNavigationState<ParamListBase>,
	BottomTabNavigationOptions,
	BottomTabNavigationEventMap
> &
	TabRouterOptions &
	BottomTabNavigationConfig & { layout?: unknown };

function BottomTabNavigator({
	id,
	initialRouteName,
	backBehavior,
	children,
	layout,
	screenListeners,
	screenOptions,
	sceneContainerStyle,
	...rest
}: Props) {
	const { state, descriptors, navigation, NavigationContent } = useNavigationBuilder<
		TabNavigationState<ParamListBase>,
		TabRouterOptions,
		TabActionHelpers<ParamListBase>,
		BottomTabNavigationOptions,
		BottomTabNavigationEventMap
	>(TabRouter, {
		id,
		initialRouteName,
		backBehavior,
		children,
		// @ts-expect-error The layout property has been added after the last release of react-navigation.
		layout,
		screenListeners,
		screenOptions,
	});

	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	return (
		<NavigationContent>
			{screenSize === 'small' ? (
				<BottomTabView
					tabBar={ScaffoldMobileCC}
					{...rest}
					state={state}
					navigation={navigation}
					descriptors={descriptors}
					sceneContainerStyle={sceneContainerStyle}
				/>
			) : (
				<ScaffoldDesktopCC
					state={state}
					navigation={navigation}
					descriptors={descriptors}>
					{descriptors[state.routes[state.index]!.key]!.render()}
				</ScaffoldDesktopCC>
			)}
		</NavigationContent>
	);
}

export const createCustomNavigator = createNavigatorFactory<
	TabNavigationState<ParamListBase>,
	BottomTabNavigationOptions,
	BottomTabNavigationEventMap,
	typeof BottomTabNavigator
>(BottomTabNavigator);
