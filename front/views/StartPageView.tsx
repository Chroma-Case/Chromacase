import React from "react";
import { useNavigation } from "../Navigation";
import {
	View,
	Text,
	Stack,
	Box,
	useToast,
	AspectRatio,
	Column,
	useBreakpointValue,
	Image,
	Link,
	Center,
	Row,
	Heading,
	Icon,
} from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import BigActionButton from "../components/BigActionButton";
import API, { APIError } from "../API";
import { setAccessToken } from "../state/UserSlice";
import { useDispatch } from "../state/Store";
import { translate } from "../i18n/i18n";

const handleGuestLogin = async (
	apiSetter: (accessToken: string) => void
): Promise<string> => {
	const apiAccess = await API.createAndGetGuestAccount();
	apiSetter(apiAccess);
	return translate("loggedIn");
};

const imgLogin =
	"https://media.discordapp.net/attachments/717080637038788731/1095980610981478470/Octopus_a_moder_style_image_of_a_musician_showing_a_member_card_c0b9072c-d834-40d5-bc83-796501e1382c.png?width=657&height=657";
const imgGuest =
	"https://media.discordapp.net/attachments/717080637038788731/1095996800835539014/Chromacase_guest_2.png?width=865&height=657";
const imgRegister =
	"https://media.discordapp.net/attachments/717080637038788731/1095991220267929641/chromacase_register.png?width=1440&height=511";

const imgBanner =
	"https://chromacase.studio/wp-content/uploads/2023/03/music-sheet-music-color-2462438.jpg";

const imgLogo =
	"https://chromacase.studio/wp-content/uploads/2023/03/cropped-cropped-splashLogo-280x300.png";

const StartPageView = () => {
	const navigation = useNavigation();
	const screenSize = useBreakpointValue({ base: "small", md: "big" });
	const isSmallScreen = screenSize === "small";
	const dispatch = useDispatch();
	const toast = useToast();

	return (
		<View
			style={{
				width: "100%",
				height: "100%",
			}}
		>
			<Center>
				<Row
					style={{
						alignItems: "center",
						justifyContent: "center",
						marginTop: 20,
					}}
				>
					<Icon
						as={
							<Image
								alt="Chromacase logo"
								source={{
									uri: imgLogo,
								}}
							/>
						}
						size={isSmallScreen ? "5xl" : "6xl"}
					/>
					<Heading fontSize={isSmallScreen ? "3xl" : "5xl"}>Chromacase</Heading>
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
					onPress={() => navigation.navigate("Login", { isSignup: false })}
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
						try {
							handleGuestLogin((accessToken: string) => {
								dispatch(setAccessToken(accessToken));
							});
						} catch (error) {
							if (error instanceof APIError) {
								toast.show({ description: translate(error.userMessage) });
								return;
							}
							toast.show({ description: error as string });
						}
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
					onPress={() => navigation.navigate("Login", { isSignup: true })}
					style={{
						height: "150px",
						width: isSmallScreen ? "90%" : "clamp(150px, 50%, 600px)",
					}}
				/>
			</Center>
			<Column
				style={{
					width: "100%",
					marginTop: 40,
					display: "flex",
					alignItems: "center",
				}}
			>
				<Box
					style={{
						maxWidth: "90%",
					}}
				>
					<Heading fontSize="4xl" style={{ textAlign: "center" }}>
						What is Chromacase?
					</Heading>
					<Text fontSize={"xl"}>
						Chromacase is a free and open source project that aims to provide a
						complete learning experience for anyone willing to learn piano.
					</Text>
				</Box>

				<Box
					style={{
						width: "90%",
						marginTop: 20,
					}}
				>
					<Box
						style={{
							width: "100%",
							height: "100%",
							display: "flex",
							alignItems: "center",
						}}
					>
						<Link
							href="https://chromacase.studio"
							isExternal
							style={{
								width: "clamp(200px, 100%, 700px)",
								position: "relative",
								overflow: "hidden",
								borderRadius: 10,
							}}
						>
							<AspectRatio ratio={40 / 9} style={{ width: "100%" }}>
								<Image
									alt="Chromacase Banner"
									source={{ uri: imgBanner }}
									resizeMode="cover"
								/>
							</AspectRatio>
							<Box
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									height: "100%",
									backgroundColor: "rgba(0,0,0,0.5)",
								}}
							></Box>
							<Heading
								fontSize="2xl"
								style={{
									textAlign: "center",
									position: "absolute",
									top: "40%",
									left: 20,
									color: "white",
								}}
							>
								Click here for more infos
							</Heading>
						</Link>
					</Box>
				</Box>
			</Column>
		</View>
	);
};

export default StartPageView;
