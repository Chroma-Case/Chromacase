import React from 'react';
import { Dimensions, View } from 'react-native';
import { Box, Image, Heading, HStack, Card, Button, Spacer, Text } from 'native-base';
import Translate from '../components/Translate';
import { useNavigation } from '@react-navigation/native';
import TextButton from '../components/TextButton';

const UserMedals = () => {
    return (
        <Card marginX={20} marginY={10}>
            <Heading>
                <Translate translationKey='medals'/>
            </Heading>
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
    const answer = "Answer from back";

    return(
        <Card marginX={20} marginY={10}>
            <Heading>   <Translate translationKey='playerStats'/>             </Heading>
            <Text>      <Translate translationKey='mostPlayedSong'/> {answer}    </Text>
            <Text>      <Translate translationKey='goodNotesPlayed'/> {answer}   </Text>
            <Text>      <Translate translationKey='longestCombo'/> {answer}      </Text>
            <Text>      <Translate translationKey='favoriteGenre'/> {answer}     </Text>
        </Card>

    );
}

const ProfilePictureBannerAndLevel = () => {
    const profilePic = "https://wallpaperaccess.com/full/317501.jpg"
    const username = "Username"
    const level = "1"

    // banner size
    const dimensions = Dimensions.get('window');
    const imageHeight = dimensions.height / 5;
    const imageWidth = dimensions.width;

    // need to change the padding for the username and level

    return (
        <View style={{flexDirection: 'row'}}>
            <Image source={{ uri : "https://wallpaperaccess.com/full/317501.jpg" }} size="lg" 
                   style={{ height: imageHeight, width: imageWidth, zIndex:0, opacity: 0.5 }}
            />
            <Box zIndex={1} position={"absolute"} marginY={10} marginX={10}>
                <Image borderRadius={100} source={{ uri: profilePic }} 
                       alt="Profile picture" size="lg" 
                       style= {{position: 'absolute'}}
	            />
                <Box w="100%" paddingY={3} paddingLeft={100}>
                    <Heading>{username}</Heading>
                    <Heading>Level : {level}</Heading>
                </Box>
            </Box>
        </View>
    );
}

const ProfileView = () => {
    const navigation = useNavigation();

    return (
    <View style={{flexDirection: 'column'}}>
        <ProfilePictureBannerAndLevel/>
        <UserMedals/>
        <PlayerStats/>
        <Box w="10%" paddingY={10} paddingLeft={5} paddingRight={50} zIndex={1}>
            <TextButton
                onPress={() => navigation.navigate('Settings')}
                style={{margin: 10}}
                translate={{ translationKey: 'settingsBtn' }}
            />
        </Box>
    </View>
    );
}

export default ProfileView;