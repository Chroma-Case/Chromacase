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
	BottomTabHeaderProps,
	BottomTabNavigationEventMap,
	BottomTabNavigationOptions,
	BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import { BottomTabView } from '@react-navigation/bottom-tabs';

import { Screen, Header, getHeaderTitle, SafeAreaProviderCompat } from '@react-navigation/elements';

import ScaffoldMobileCC from '../components/UI/ScaffoldMobileCC';
import { useBreakpointValue, useTheme } from 'native-base';
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
	const descriptor = descriptors[state.routes[state.index]!.key]!;
	const header =
		descriptor.options.header ??
		(({ layout, options }: BottomTabHeaderProps) => (
			<Header
				{...options}
				layout={layout}
				title={getHeaderTitle(options, state.routes[state.index]!.name)}
			/>
		));
	const dimensions = SafeAreaProviderCompat.initialMetrics.frame;

	return (
		<NavigationContent>
			{screenSize === 'small' ? (
				<BottomTabView
					tabBar={ScaffoldMobileCC}
					{...rest}
					state={state}
					navigation={navigation}
					descriptors={descriptors}
					sceneContainerStyle={[sceneContainerStyle, { backgroundColor: "transparent" }]}
				/>
			) : (
				<ScaffoldDesktopCC state={state} navigation={navigation} descriptors={descriptors}>
					<Screen
						focused
						navigation={descriptor.navigation}
						route={descriptor.route}
						headerShown={descriptor.options.headerShown}
						headerStatusBarHeight={descriptor.options.headerStatusBarHeight}
						headerTransparent={descriptor.options.headerTransparent}
						header={header({
							layout: dimensions,
							route: descriptor.route,
							navigation:
								descriptor.navigation as BottomTabNavigationProp<ParamListBase>,
							options: descriptor.options,
						})}
						style={[sceneContainerStyle, { backgroundColor: "transparent" }]}
					>
						{descriptor.render()}
					</Screen>
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
