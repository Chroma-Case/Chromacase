import React from 'react';
import { translate } from '../i18n/i18n';
import { Box, Text, VStack, Progress, Stack } from 'native-base';
import { useNavigation } from '../Navigation';
import Card from '../components/Card';
import UserAvatar from './UserAvatar';

const ProgressBar = ({ xp }: { xp: number }) => {
	const level = Math.floor(xp / 1000);
	const nextLevel = level + 1;
	const nextLevelThreshold = nextLevel * 1000;
	const progessValue = (100 * xp) / nextLevelThreshold;

	const nav = useNavigation();

	return (
		<Card w="100%" onPress={() => nav.navigate('User', {})}>
			<Stack padding={4} space={2} direction="row" alignItems="center">
				<UserAvatar />
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
