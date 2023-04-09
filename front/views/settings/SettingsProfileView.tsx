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
			<Column>
				<Center>
					<Avatar size="2xl" source={{ uri: user.data.avatar }}>
						{getInitials(user.name)}
						<Avatar.Badge bg="gray.300" size={35}>
							<IconButton
								size={"sm"}
								icon={<Icon as={FontAwesome5} name="edit" />}
							/>
						</Avatar.Badge>
					</Avatar>
				</Center>
				<Row
					style={{
						paddingTop: 20,
						alignItems: "center",
					}}
				>
					<Heading>{user.name}</Heading>
					<Button
						ml={2}
						size="sm"
						leftIcon={<Icon as={FontAwesome5} name="edit" size="sm" />}
						variant="ghost"
						colorScheme="primary"
						style={{
							borderRadius: 10,
						}}
					></Button>
				</Row>

				<Text>Username: {user.name}</Text>
				<Text>ID: {user.id}</Text>
				<Text>Email: {user.email}</Text>
				<Text>Party played: {user.data.partyPlayed}</Text>

				<Text>XP: {user.data.xp}</Text>

				<ElementList
					elements={[
						{
							title: "Username",
							node: <Text>{user.name}</Text>,
						},
						{
							title: "ID",
							node: <Text>{user.id}</Text>,
						},
						{
							title: "Email",
							node: <Text>{user.email}</Text>,
						},
						{
							title: "Party played",
							node: <Text>{user.data.partyPlayed}</Text>,
						},
						{
							title: "XP",
							node: <Text>{user.data.xp}</Text>,
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
