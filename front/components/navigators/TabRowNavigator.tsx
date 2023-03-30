import * as React from "react";
import { StyleProp, ViewStyle, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
	View,
	Text,
	Pressable,
	Box,
	Row,
	Icon,
	Button,
	useBreakpointValue,
} from "native-base";
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
import IconButton from "../IconButton";

// Props accepted by the view
type TabNavigationConfig = {
	tabBarStyle: StyleProp<ViewStyle>;
	contentStyle: StyleProp<ViewStyle>;
};

// Supported screen options
type TabNavigationOptions = {
	title?: string;
	iconProvider?: any;
	iconName?: string;
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

	const screenSize = useBreakpointValue({ base: "small", md: "big" });
	const [isPanelView, setIsPanelView] = React.useState(false);
	const isMobileView = screenSize == "small";

	return (
		<NavigationContent>
			<Row height={"900px"}>
				{(!isMobileView || isPanelView) && (
					<View
						style={[
							{
								display: "flex",
								flexDirection: "column",
								justifyContent: "flex-start",
								borderRightWidth: 1,
								borderRightColor: "lightgray",
								overflow: "scroll",
								width: isMobileView ? "100%" : undefined,
							},
							tabBarStyle,
						]}
					>
						{state.routes.map((route) => {
							const isSelected = route.key === state.routes[state.index]?.key;
							const { options } = descriptors[route.key];

							return (
								<Button
									variant={"ghost"}
									key={route.key}
									onPress={() => {
										const event = navigation.emit({
											type: "tabPress",
											target: route.key,
											canPreventDefault: true,
											data: {
												isAlreadyFocused: isSelected,
											},
										});

										if (!event.defaultPrevented) {
											navigation.dispatch({
												...CommonActions.navigate(route),
												target: state.key,
											});
										}
										if (isMobileView) {
											setIsPanelView(false);
										}
									}}
									bgColor={isSelected ? "primary.300" : undefined}
									style={{
										justifyContent: "flex-start",
										padding: "10px",
										height: "50px",
										width: "250px",
									}}
									leftIcon={
										options.iconProvider && options.iconName ? (
											<Icon
												as={options.iconProvider}
												name={options.iconName}
												size="xl"
												color="black"
											/>
										) : undefined
									}
								>
									<Text fontSize="lg" isTruncated w="100%">
										{options.title || route.name}
									</Text>
								</Button>
							);
						})}
					</View>
				)}
				{(!isMobileView || !isPanelView) && (
					<View
						style={[
							{ flex: 1, width: isMobileView ? "100%" : "700px" },
							contentStyle,
						]}
					>
						{isMobileView && (
							<Button
								style={{
									position: "absolute",
									top: "10px",
									left: "10px",
									zIndex: 100,
								}}
								onPress={() => setIsPanelView(true)}
								leftIcon={
									<Icon
										as={Ionicons}
										name="arrow-back"
										size="xl"
										color="black"
									/>
								}
							/>
						)}
						{descriptors[state.routes[state.index]?.key]?.render()}
					</View>
				)}
			</Row>
		</NavigationContent>
	);
}

export default createNavigatorFactory<
	TabNavigationState<ParamListBase>,
	TabNavigationOptions,
	TabNavigationEventMap,
	typeof TabNavigator
>(TabNavigator);
