import React from "react";
import { useNavigation } from "../Navigation";
import {
	View,
	Text,
	Stack,
	Box,
	Button,
	Pressable,
	useBreakpointValue,
	Image,
	Center,
	Row,
	Heading,
	Icon,
} from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import Card from "../components/Card";
import BigActionButton from "../components/BigActionButton";

const imgLogin =
	"https://imgs.search.brave.com/xX-jA3Rspi-ptSFABle5hpVNdOyKDHdVYNr320buGyQ/rs:fit:1200:800:1/g:ce/aHR0cDovL3d3dy5z/dHJhdGVnaWMtYnVy/ZWF1LmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAxNC8wNy9B/TVgtMTBSQ1ItMTAw/LVNCSS1EUy5qcGc";
const imgGuest =
	"https://imgs.search.brave.com/BzxPphCCWbF_Vm0KhenmxH61M3Vm3_HhxWO0s_rw4Nk/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9pLnJl/ZGQuaXQvYW9waWtp/dXFrOTV6LmpwZw";
const imgRegister =
	"https://media.discordapp.net/attachments/717080637038788731/1093674574027182141/image.png";
const StartPageView = () => {
	const navigation = useNavigation();
	const screenSize = useBreakpointValue({ base: "small", md: "big" });
	const isSmallScreen = screenSize === "small";
	return (
		<View>
			<Center>
				<Row
					style={{
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Icon
						as={
							<Image
								alt="Chromacase logo"
								source={{
									uri: "https://chromacase.studio/wp-content/uploads/2023/03/cropped-cropped-splashLogo-280x300.png",
								}}
							/>
						}
						size={isSmallScreen ? "5xl" : "6xl"}
					/>
					<Heading fontSize={isSmallScreen ? "3xl" : "5xl"}>
						Chromacase
					</Heading>
				</Row>
			</Center>
			<Stack
				direction={screenSize === "small" ? "column" : "row"}
				style={{
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<BigActionButton
					title="Authenticate"
					subtitle="Save and resume your learning at anytime on all devices"
					image={imgLogin}
					iconName="user"
					iconProvider={FontAwesome5}
					onPress={() => {
						console.log("login");
					}}
					style={{
						width: isSmallScreen ? "90%" : "clamp(100px, 33.3%, 600px)",
						height: "300px",
						margin: "clamp(10px, 2%, 50px)",
					}}
				/>
				<BigActionButton
					title="Test Chromacase"
					subtitle="Use a guest account to see around but your progression won't be saved"
					image={imgGuest}
					iconName="user-clock"
					iconProvider={FontAwesome5}
					onPress={() => {
						console.log("guest");
					}}
					style={{
						width: isSmallScreen ? "90%" : "clamp(100px, 33.3%, 600px)",
						height: "300px",
						margin: "clamp(10px, 2%, 50px)",
					}}
				/>
			</Stack>
			<Center>
				<BigActionButton
					title="Register"
					image={imgRegister}
					subtitle="Create an account to save your progress"
					iconProvider={FontAwesome5}
					iconName="user-plus"
					onPress={() => {
						console.log("register");
					}}
					style={{
						height: "150px",
						width: isSmallScreen ? "90%" : "clamp(150px, 50%, 600px)",
					}}
				/>
			</Center>
		</View>
	);
};

export default StartPageView;
