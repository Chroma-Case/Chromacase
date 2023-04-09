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
} from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import User from "../../models/User";
import TextButton from "../../components/TextButton";
import LoadingComponent from "../../components/Loading";
import ElementList from "../../components/GtkUI/ElementList";

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
	const [toggle, setToggle] = useState(false);

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
						maxWidth: 1000,
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
							title: "Email",
							data: {
								text: user.email,
							},
						},
						{
							type: "text",
							title: "ID",
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
							data: {
								text: user.data.xp,
							},
						},
						{
							type: "text",
							title: "Date de création",
							data: {
								text: user.data.createdAt,
							},
						},
						{
							type: "toggle",
							title: "Notifications",
							data: {
								value: toggle,
								onToggle: () => {
									console.log("toggle", toggle);
									setToggle(!toggle);
								},
							},
						},
						{
							type: "dropdown",
							title: "Langue",
							data: {
								value: "fr",
								options: [
									{
										label: "Français",
										value: "fr",
									},
									{
										label: "English",
										value: "en",
									},
								],
								onSelect: (value) => console.log(value),
							},
						},
					]}
				/>
			</Column>

			<TextButton
				onPress={() => dispatch(unsetAccessToken())}
				translate={{
					translationKey: "signOutBtn",
				}}
			/>
		</Flex>
	);
};

export default ProfileSettings;
