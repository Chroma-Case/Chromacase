import React from 'react';
import { View } from 'react-native';
import { Box, Heading, HStack } from 'native-base';
import { useNavigation } from '../Navigation';
import TextButton from '../components/TextButton';
import UserAvatar from '../components/UserAvatar';
import { LoadingView } from '../components/Loading';
import { useQuery } from '../Queries';
import API from '../API';

const ProfileView = () => {
	const navigation = useNavigation();
	const userQuery = useQuery(API.getUserInfo);
	
	if (!userQuery.data) {
		return <LoadingView/>
	}

	return (
		<View style={{ flexDirection: 'column' }}>
			<HStack space={3} marginY={10} marginX={10}>
				<UserAvatar size="lg" />
				<Box>
					<Heading>{userQuery.data.name}</Heading>
					<Heading>XP : {userQuery.data.data.xp}</Heading>
				</Box>
			</HStack>
			<Box w="10%" paddingY={10} paddingLeft={5} paddingRight={50}>
				<TextButton
					onPress={() => navigation.navigate('Settings', { screen: 'profile' })}
					translate={{ translationKey: 'settingsBtn' }}
				/>
			</Box>
		</View>
	);
};

export default ProfileView;
