import React from 'react';
import { View } from 'react-native';
import { Box, Image, Heading, HStack, Card, Button, Spacer } from 'native-base';
import Translate from '../components/Translate';
import { useNavigation } from '@react-navigation/native';

const UserMedals = () => {
    return (
        <Card marginX={20} marginY={10}>
            <Translate translationKey='medals'/>
            <HStack alignItems={'row'} space='10'>
                <Image source={{
                    uri: "https://wallpaperaccess.com/full/317501.jpg"
                }} alt="Profile picture" size="lg"
                />
                <Image source={{
                    uri: "https://wallpaperaccess.com/full/317501.jpg"
                }} alt="Profile picture" size="lg"
                />
                <Image source={{
                    uri: "https://wallpaperaccess.com/full/317501.jpg"
                }} alt="Profile picture" size="lg"
                />
                <Image source={{
                    uri: "https://wallpaperaccess.com/full/317501.jpg"
                }} alt="Profile picture" size="lg"
                />
            </HStack>
        </Card>
    );
}

const PlayerStats = () => {
    return(
        <Card marginX={20} marginY={10}>
            <Translate translationKey='playerStats'/>
            <Translate translationKey='mostPlayedSong'/>
            <Translate translationKey='goodNotesPlayed'/>
            <Translate translationKey='longestCombo'/>
            <Translate translationKey='favoriteGenre'/>
        </Card>
    );
}

const ProfilePicture = () => {
    return (
        <View style={{flexDirection: 'row', marginHorizontal: 30, marginVertical: 10}}>
	    	<Image borderRadius={100} source={{
          		   uri: "https://wallpaperaccess.com/full/317501.jpg" // TODO : put the actual profile pic
        		}} alt="Profile picture" size="lg"
	    	/>
            <Box w="100%" paddingY={10} paddingLeft={5}>
            <Heading>Username</Heading>
            </Box>
        </View>
    );
}

const ProfileView = () => {
    const navigation = useNavigation();

    return (
    <View style={{flexDirection: 'column'}}>
        <View style={{flexDirection: 'row'}}>
            <ProfilePicture/>
            <Spacer/>
            <Box w="10%" paddingY={10} paddingLeft={5} paddingRight={50}>
                <Button onPress={() => navigation.navigate('Settings')} style={{margin: 10}}>
                    <Translate translationKey='settingsBtn'/>
                </Button>
            </Box>
        </View>
        <UserMedals/>
        <PlayerStats/>
    </View>
    );
}

export default ProfileView;