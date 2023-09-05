import React from 'react';
import { Dimensions, View } from 'react-native';
import { Box, Image, Heading, HStack } from 'native-base';
import { useNavigation } from '../Navigation';
import TextButton from '../components/TextButton';
import UserAvatar from '../components/UserAvatar';

const ProfilePictureBannerAndLevel = () => {
	const username = 'Username';
	const level = '1';

	// banner size
	const dimensions = Dimensions.get('window');
	const imageHeight = dimensions.height / 5;
	const imageWidth = dimensions.width;

	// need to change the padding for the username and level

	return (
		<View style={{ flexDirection: 'row' }}>
			<Image
				source={{ uri: 'https://wallpaperaccess.com/full/317501.jpg' }}
				size="lg"
				style={{ height: imageHeight, width: imageWidth, zIndex: 0, opacity: 0.5 }}
			/>
			<HStack zIndex={1} space={3} position={'absolute'} marginY={10} marginX={10}>
				<UserAvatar size="lg" />
				<Box>
					<Heading>{username}</Heading>
					<Heading>Level : {level}</Heading>
				</Box>
			</HStack>
		</View>
	);
};

const ProfileView = () => {
	const navigation = useNavigation();

	return (
		<View style={{ flexDirection: 'column' }}>
			<ProfilePictureBannerAndLevel />
			<Box w="10%" paddingY={10} paddingLeft={5} paddingRight={50} zIndex={1}>
				<TextButton
					onPress={() => navigation.navigate('Settings', { screen: 'profile' })}
					translate={{ translationKey: 'settingsBtn' }}
				/>
			</Box>
		</View>
	);
};

export default ProfileView;
