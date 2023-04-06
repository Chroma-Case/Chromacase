import React from "react";
import {
	Box,
	Center,
	Heading,
	Image,
	Text,
	Pressable,
	useBreakpointValue,
	Icon,
	Row,
	PresenceTransition,
} from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleProp, ViewStyle } from "react-native";

type BigActionButtonProps = {
	title: string;
	subtitle: string;
	image: string;
	style?: StyleProp<ViewStyle>;
	iconName?: string;
	iconProvider?: any;
	onPress: () => void;
};

// a button with a picture in the background a title and a subtitle
// on hover the picture is zoomed in and the title and subtitle are displayed
const BigActionButton = ({
	title,
	subtitle,
	image,
	style,
	iconName,
	iconProvider,
	onPress,
}: BigActionButtonProps) => {
	const screenSize = useBreakpointValue({ base: "small", md: "big" });
	return (
		<Pressable onPress={onPress} style={style}>
			{({ isHovered, isPressed }) => {
				return (
					<Box
						style={{
							width: "100%",
							height: "100%",
							position: "relative",
							borderRadius: 10,
							overflow: "hidden",
						}}
					>
						<PresenceTransition
							style={{
								width: "100%",
								height: "100%",
							}}
							visible={isHovered}
							initial={{
								scale: 1,
							}}
							animate={{
								scale: 1.1,
							}}
						>
							<Image
								source={{ uri: image }}
								alt="image"
								style={{
									width: "100%",
									height: "100%",
									resizeMode: "cover",
									borderRadius: 10,
								}}
							/>
						</PresenceTransition>
						<PresenceTransition
							style={{
								height: "30%",
							}}
							visible={isHovered}
							initial={{
								translateY: -40,
                                opacity: 0.8,
							}}
							animate={{
								translateY: -85,
                                opacity: 1,
							}}
						>
							<Box
								style={{
									position: "absolute",
									left: "0",
									width: "100%",
									height: "100%",
									backgroundColor: "white",
									padding: "10px",
								}}
							>
								<PresenceTransition
									visible={isHovered}
									initial={{
										scale: 1,
									}}
									animate={{
										scale: 1.2,
										translateX: 40,
									}}
								>
									<Row>
										<Icon
											as={iconProvider}
											name={iconName}
											size={screenSize === "small" ? "sm" : "md"}
											color="black"
											marginRight="10px"
										/>
										<Heading fontSize={screenSize === "small" ? "md" : "xl"} isTruncated>
											{title}
										</Heading>
									</Row>
								</PresenceTransition>
								{isHovered && (
									<PresenceTransition
										visible={isHovered}
										initial={{
											opacity: 0,
											translateY: 10,
										}}
										animate={{
											opacity: 1,
											translateY: 0,
										}}
									>
										<Text fontSize={screenSize === "small" ? "sm" : "md"} isTruncated noOfLines={2}>
											{subtitle}
										</Text>
									</PresenceTransition>
								)}
							</Box>
						</PresenceTransition>
					</Box>
				);
			}}

			{/* The text should be visible on the bottom left corner and when hovering the 
button the image will darken and the subtitle will be show in a transition */}
		</Pressable>
	);
};

export default BigActionButton;
