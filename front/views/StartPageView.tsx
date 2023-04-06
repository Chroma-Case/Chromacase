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
} from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import Card from "../components/Card";
import BigActionButton from "../components/BigActionButton";

const imgLogin =
	"https://imgs.search.brave.com/xX-jA3Rspi-ptSFABle5hpVNdOyKDHdVYNr320buGyQ/rs:fit:1200:800:1/g:ce/aHR0cDovL3d3dy5z/dHJhdGVnaWMtYnVy/ZWF1LmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAxNC8wNy9B/TVgtMTBSQ1ItMTAw/LVNCSS1EUy5qcGc";
const imgGuest =
	"https://imgs.search.brave.com/BzxPphCCWbF_Vm0KhenmxH61M3Vm3_HhxWO0s_rw4Nk/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9pLnJl/ZGQuaXQvYW9waWtp/dXFrOTV6LmpwZw";

const StartPageView = () => {
	const navigation = useNavigation();
	const screenSize = useBreakpointValue({ base: "small", md: "big" });
	return (
		<View>
			<Text>StartPage</Text>
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
						width: "clamp(100px, 33.3%, 400px)",
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
						width: "clamp(100px, 33.3%, 400px)",
						height: "300px",
						margin: "clamp(10px, 2%, 50px)",
					}}
				/>
			</Stack>
		</View>
	);
};

export default StartPageView;
