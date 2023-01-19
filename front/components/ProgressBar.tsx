import React from "react";
import { translate } from "../i18n/i18n";
import { Box, useBreakpointValue, Text, VStack, Progress } from 'native-base';
import { useNavigation } from "@react-navigation/native";
import { Pressable, Image } from "native-base";
import Card from "../components/Card";

const ProgressBar = ({ xp }: { xp: number}) => {
	const level = Math.floor(xp / 1000);
	const nextLevel = level + 1;
	const nextLevelThreshold = nextLevel * 1000;
	const progessValue = 100 * xp / nextLevelThreshold;
	
	const nav = useNavigation();
	const flexDirection = useBreakpointValue({ base: 'column', xl: "row"});

	return (
		<Pressable onPress={() => nav.navigate('User')}>
		{({ isHovered,  isFocused }) => (
			<Card w="90%" maxW='500' style={{flexDirection}}
				  bg={(isHovered || isFocused) ? 'coolGray.200' : undefined }>
				<Box w="20%" paddingRight={2} paddingLeft={2} paddingY={2}>
					<Image borderRadius={100} source={{
      					uri: "https://wallpaperaccess.com/full/317501.jpg" // TODO : put the actual profile pic
    				}} alt="Profile picture" size="sm"
					/>
				</Box>

				<Box w='80%' paddingY={4}>
					<VStack alignItems={'center'}>
						<Text>{`${translate('level')} ${level}`}</Text>
						<Box w="100%">
							<Progress value={progessValue} mx="4" />
						</Box>
						<Text>{xp} / {nextLevelThreshold} {translate('levelProgress')}</Text>
					</VStack>
				</Box>
			</Card>
		)}
		</Pressable>
	);
}

export default ProgressBar;