import * as React from "react";
import {
	View,
	Text,
	Pressable,
	StyleProp,
	ViewStyle,
	StyleSheet,
} from "react-native";
import { Box } from "native-base";
import {
	createNavigatorFactory,
	DefaultNavigatorOptions,
	ParamListBase,
	CommonActions,
	TabActionHelpers,
	TabNavigationState,
	TabRouter,
	TabRouterOptions,
	useNavigationBuilder,
} from "@react-navigation/native";

// Props accepted by the view
type TabNavigationConfig = {
	tabBarStyle: StyleProp<ViewStyle>;
	contentStyle: StyleProp<ViewStyle>;
};

// Supported screen options
type TabNavigationOptions = {
	title?: string;
};

// Map of event name and the type of data (in event.data)
//
// canPreventDefault: true adds the defaultPrevented property to the
// emitted events.
type TabNavigationEventMap = {
	tabPress: {
		data: { isAlreadyFocused: boolean };
		canPreventDefault: true;
	};
};

// The props accepted by the component is a combination of 3 things
type Props = DefaultNavigatorOptions<
	ParamListBase,
	TabNavigationState<ParamListBase>,
	TabNavigationOptions,
	TabNavigationEventMap
> &
	TabRouterOptions &
	TabNavigationConfig;

function TabNavigator({
	initialRouteName,
	children,
	screenOptions,
	tabBarStyle,
	contentStyle,
}: Props) {
	const { state, navigation, descriptors, NavigationContent } =
		useNavigationBuilder<
			TabNavigationState<ParamListBase>,
			TabRouterOptions,
			TabActionHelpers<ParamListBase>,
			TabNavigationOptions,
			TabNavigationEventMap
		>(TabRouter, {
			children,
			screenOptions,
			initialRouteName,
		});

	return (
		<NavigationContent>
            <Box style={{ display: "flex", flexDirection: "row" }}>
			<View style={[{ flexDirection: "column", width: "300px" }, tabBarStyle]}>
				{state.routes.map((route) => (
					<Pressable
						key={route.key}
						onPress={() => {
							const event = navigation.emit({
								type: "tabPress",
								target: route.key,
								canPreventDefault: true,
								data: {
									isAlreadyFocused: route.key === state.routes[state.index].key,
								},
							});

							if (!event.defaultPrevented) {
								navigation.dispatch({
									...CommonActions.navigate(route),
									target: state.key,
								});
							}
						}}
						style={{ flex: 1 }}
					>
						<Text>{descriptors[route.key].options.title || route.name}</Text>
					</Pressable>
				))}
			</View>
			<View style={[{ flex: 1, width: "700px" }, contentStyle]}>
				{state.routes.map((route, i) => {
					return (
						<View
							key={route.key}
							style={[
								StyleSheet.absoluteFill,
								{ display: i === state.index ? "flex" : "none" },
							]}
						>
							{descriptors[route.key].render()}
						</View>
					);
				})}
			</View>
            </Box>
		</NavigationContent>
	);
}

export default createNavigatorFactory<
	TabNavigationState<ParamListBase>,
	TabNavigationOptions,
	TabNavigationEventMap,
	typeof TabNavigator
>(TabNavigator);
