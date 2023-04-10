import API from "../../API";
import { useDispatch } from "react-redux";
import { unsetAccessToken } from "../../state/UserSlice";

import React, { useEffect, useState } from "react";
import {
	Column,
	Text,
	Button,
	Icon,
	Box,
	IconButton,
	Flex,
	Row,
	Center,
	Heading,
	Avatar,
	Popover,
} from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import User from "../../models/User";
import TextButton from "../../components/TextButton";
import LoadingComponent from "../../components/Loading";
import ElementList from "../../components/GtkUI/ElementList";
import { translate } from "../../i18n/i18n";

const getInitials = (name: string) => {
	const names = name.split(" ");
	if (names.length === 1) return names[0]?.charAt(0);
	let initials = [];
	for (let i = 0; i < names.length; i++) {
		initials.push(names[i]?.charAt(0));
	}
	return initials.join("");
};

const ProfileSettings = ({ navigation }: { navigation: any }) => {
	const [user, setUser] = useState<User | null>(null);
	const dispatch = useDispatch();
	const [toggle, setToggle] = useState(true);
	const [selectValue, setSelectValue] = useState("fr");

	useEffect(() => {
		API.getUserInfo().then((user) => {
			setUser(user);
		});
	}, []);

	if (!user) {
		return (
			<Center style={{ flex: 1 }}>
				<LoadingComponent />
			</Center>
		);
	}

	return (
		<Flex
			style={{
				flex: 1,
				alignItems: "center",
				paddingTop: 40,
			}}
		>
			<Column
				style={{
					width: "100%",
					alignItems: "center",
				}}
			>
				<Center>
					<Avatar size="2xl" source={{ uri: user.data.avatar }}>
						{getInitials(user.name)}
					</Avatar>
				</Center>
				<ElementList
					style={{
						marginTop: 20,
						width: "90%",
						maxWidth: 850,
					}}
					elements={[
						{
							type: "text",
							title: "Email",
							data: {
								text: user.email || "Aucun email associé",
								onPress: () => {
									navigation.navigate("ChangeEmail");
								},
							},
						},
					]}
				/>

				<ElementList
					style={{
						marginTop: 20,
						width: "90%",
						maxWidth: 850,
					}}
					elements={[
						{
							type: "text",
							title: "Username",
							data: {
								text: user.name,
							},
						},
						{
							type: "text",
							title: "ID",
							helperText: "This is your unique ID, be proud of it!",
							data: {
								text: user.id,
							},
						},
						{
							type: "text",
							title: "Party played",
							data: {
								text: user.data.partyPlayed,
							},
						},
						{
							type: "text",
							title: "XP",
							description:
								"XP is the experience points you get by playing games",
							data: {
								text: user.data.xp,
							},
						},
						{
							type: "text",
							title: "Date de création",
							helperText:
								"La date de création est actuellement arbitraire car le serveur ne retourne pas cette information",
							data: {
								text: user.data.createdAt,
							},
						},
						{
							type: "text",
							title: "Compte Premium",
							data: {
								text: user.premium ? "Oui" : "Non",
							},
						}
					]}
				/>
				<Heading fontSize="20" mt="7">
					Fonctionnalités premium
				</Heading>
				<ElementList
					style={{
						marginTop: 10,
						width: "90%",
						maxWidth: 850,
					}}
					elements={[
						{
							type: "toggle",
							title: "Piano Magique",
							description: "Fait apparaître de la lumière sur le piano pendant les parties",
							helperText: "Vous devez posséder le module physique lumineux Chromacase pour pouvoir utiliser cette fonctionnalité",
							disabled: true,
							data: {
								value: false,
								onToggle: () => {},
							},
						},
						{
							type: "dropdown",
							title: "Thème de piano",
							disabled: true,
							data: {
								value: "default",
								onValueChange: () => {},
								options: [
									{
										label: "Default",
										value: "default",
									},
									{
										label: "Catpuccino",
										value: "catpuccino",
									},
								],
							},
						},
					]}
				/>
			</Column>

			<Box mt={10}>
				{!user.isGuest && (
					<TextButton
						onPress={() => dispatch(unsetAccessToken())}
						translate={{
							translationKey: "signOutBtn",
						}}
					/>
				)}
				{user.isGuest && (
					<Popover
						trigger={(triggerProps) => (
							<Button {...triggerProps}>{translate("signOutBtn")}</Button>
						)}
					>
						<Popover.Content>
							<Popover.Arrow />
							<Popover.Body>
								<Heading size="md" mb={2}>
									Attention
								</Heading>
								<Text>
									Vous êtes connecté avec un compte invité temporaire, si vous
									vous déconnectez, vous perdrez vos données.
								</Text>
								<Text>
									Vous pouvez sauvegarder votre progression en transférant votre
									compte invité vers un compte classique.
								</Text>
								<Button.Group variant="ghost" space={2}>
									<Button
										onPress={() => dispatch(unsetAccessToken())}
										colorScheme="red"
									>
										Déconnexion
									</Button>
									<Button
										onPress={() => {
											navigation.navigate("SignUp");
										}}
										colorScheme="green"
									>
										Créer un compte
									</Button>
								</Button.Group>
							</Popover.Body>
						</Popover.Content>
					</Popover>
				)}
			</Box>
		</Flex>
	);
};

export default ProfileSettings;
