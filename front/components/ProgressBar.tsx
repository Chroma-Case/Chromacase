import React from 'react';
import { Translate } from '../i18n/i18n';
import { Box, VStack, Progress, Stack } from 'native-base';
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
		<Card w="100%" onPress={() => nav.navigate('User')}>
			<Stack padding={4} space={2} direction="row" alignItems="center">
				<UserAvatar />
				<VStack alignItems={'center'} flexGrow={1} space={2}>
					<Translate translationKey="level" format={(e) => `${e} ${level}`} />
					<Box w="100%">
						<Progress value={progessValue} mx="4" />
					</Box>
					<Translate
						translationKey="levelProgress"
						format={(e) => `${xp} / ${nextLevelThreshold} ${e}`}
					/>
				</VStack>
			</Stack>
		</Card>
	);
};

export default ProgressBar;
