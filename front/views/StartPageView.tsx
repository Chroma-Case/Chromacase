import React from "react";
import { View, Text, Stack, Box, Button, Pressable, useBreakpointValue } from "native-base";
import { useNavigation } from "../Navigation";

const StartPageView = () => {
	const navigation = useNavigation();
	const screenSize = useBreakpointValue({ base: "small", md: "big" });
	return (
		<View>
			<Text>StartPage</Text>
			<Stack
				direction={ screenSize === "small" ? "column" : "row" }
				style={{
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Pressable
					style={{
						width: "clamp(100px, 33.3%, 250px)",
						height: "250px",
						margin: "clamp(10px, 2%, 50px)",
					}}
				>
					<Box
						style={{
							width: "100%",
							height: "100%",
							backgroundColor: "red",
						}}
					>
						<Text>Login</Text>
					</Box>
				</Pressable>
				<Pressable
					style={{
						width: "clamp(100px, 33.3%, 250px)",
						height: "250px",
						margin: "clamp(10px, 2%, 50px)",
					}}
				>
					<Box
						style={{
							width: "100%",
							height: "100%",
							backgroundColor: "blue",
						}}
					>
						<Text>Guest</Text>
					</Box>
				</Pressable>
			</Stack>
		</View>
	);
};

export default StartPageView;
