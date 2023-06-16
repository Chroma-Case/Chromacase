import React from 'react';
import { translate } from '../i18n/i18n';
import { Box, Text, VStack, Progress, Stack, AspectRatio } from 'native-base';
import { useNavigation } from '../Navigation';
import { Image } from 'native-base';
import Card from '../components/Card';

const ProgressBar = ({ xp }: { xp: number }) => {
	const level = Math.floor(xp / 1000);
	const nextLevel = level + 1;
	const nextLevelThreshold = nextLevel * 1000;
	const progessValue = (100 * xp) / nextLevelThreshold;

	const nav = useNavigation();

	return (
		<Card w="100%" onPress={() => nav.navigate('User')}>
			<Stack padding={4} space={2} direction="row">
				<AspectRatio ratio={1}>
					<Image
						position="relative"
						borderRadius={100}
						source={{
							uri: 'https://wallpaperaccess.com/full/317501.jpg', // TODO : put the actual profile pic
						}}
						alt="Profile picture"
						zIndex={0}
					/>
				</AspectRatio>
				<VStack alignItems={'center'} flexGrow={1} space={2}>
					<Text>{`${translate('level')} ${level}`}</Text>
					<Box w="100%">
						<Progress value={progessValue} mx="4" />
					</Box>
					<Text>
						{xp} / {nextLevelThreshold} {translate('levelProgress')}
					</Text>
				</VStack>
			</Stack>
		</Card>
	);
};

export default ProgressBar;
