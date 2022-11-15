import React from 'react';
import { View } from 'react-native';
import { Box, Image, Heading, HStack, Card, Text, Button } from 'native-base';

const ProfileView = () => {
    return (
    <View style={{flexDirection: 'column'}}>
        <View style={{flexDirection: 'row'}}>
            <Box w="20%" paddingRight={2} paddingLeft={5} paddingY={2}>
	    		<Image borderRadius={100} source={{
          			   uri: "https://wallpaperaccess.com/full/317501.jpg" // TODO : put the actual profile pic
        			}} alt="Profile picture" size="lg"
	    		/>
	    	</Box>
            <Box w="80%" paddingY={10}>
                <Heading>User</Heading>
            </Box>
        </View>

        <Card>
            <Heading>Medals</Heading>
            <HStack alignItems={'row'} space='5'>
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
            
        <Card>
            <Heading>My stats</Heading>
            <Text>Most played song : ...</Text>
            <Text>Good notes played : ...</Text>
            <Text>Longest combo : ...</Text>
            <Text>Favorite genre : ...</Text>
        </Card>

        <Button>Settings</Button>
    </View>
    );
}

export default ProfileView;