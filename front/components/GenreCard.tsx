import React from "react";
import Card, { CardBorderRadius } from './Card';
import { VStack, Text, Image, Pressable, Box, Icon } from 'native-base';
import { useNavigation } from "../Navigation";
import { useTheme } from "native-base";
type GenreCardProps = {
	image?: string;
	name?: string;
}

const GenreCard = (props: GenreCardProps) => {
	const { image, name } = props;
	const navigation = useNavigation();
	const theme = useTheme();

	return (
		<Card
		shadow={3}
		// onPress={() => navigation.navigate('Genre', { genreName: name })}
		>
			<VStack m={1.5} space={3}>
				<Box
					bg={theme.colors.primary[500]}
					w={64}
					h={64}
					borderRadius="full"
					alignSelf="center"
				>
					<Icon name="music" color="white" size={32} />
				</Box>
				<VStack>
					<Text isTruncated bold fontSize="md" noOfLines={2} height={50}>
						{name}
					</Text>
				</VStack>
			</VStack>
		</Card>
	);
}

export default GenreCard;