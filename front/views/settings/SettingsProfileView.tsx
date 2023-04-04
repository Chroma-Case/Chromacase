import API from "../../API";
import { useDispatch } from "react-redux";
import { unsetAccessToken } from "../../state/UserSlice";

import React, { useEffect, useState } from "react";
import { Column, Text, Button, Icon, Box, Center, Heading } from "native-base";
import User from "../../models/User";
import TextButton from "../../components/TextButton";

const ProfileSettings = ({ navigation }: { navigation: any }) => {
	const [user, setUser] = useState<User | null>(null);
	const dispatch = useDispatch();

	useEffect(() => {
		API.getUserInfo().then((user) => {
			setUser(user);
		});
	}, []);

	return (
		<Center style={{ flex: 1}}>
			{user && (
				<Column>
					<Heading>Profile Settings</Heading>

					<Text>Username: {user.name}</Text>
					<Text>ID: {user.id}</Text>
					<Text>Email: {user.email}</Text>
					<Text>Party played: {user.metrics.partyPlayed}</Text>

					<Text>XP: {user.xp}</Text>
				</Column>
			)}

			<TextButton onPress={() => dispatch(unsetAccessToken())} translate={{
                translationKey: "signOutBtn",
            }} />
		</Center>
	);
};

export default ProfileSettings;
