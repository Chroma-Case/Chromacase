import React from 'react';
import Card from './Card';
import { VStack, Text, Box, Image } from 'native-base';
import { useTheme } from 'native-base';

type GenreCardProps = {
	image: string;
	name: string;
	id: number;
	onPress: () => void;
};

const GenreCard = (props: GenreCardProps) => {
	const { image, name } = props;
	const theme = useTheme();

	return (
		<Card shadow={3} onPress={props.onPress}>
			<VStack m={1.5} space={3} alignItems="center">
				<Box
					bg={theme.colors.primary[300]}
					w={20}
					h={20}
					borderRadius="full"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<Image
						source={{
							uri: image,
						}}
						fallbackSource={{ uri: require('../assets/icon.jpg') }}
						size="md"
					/>
				</Box>
				<VStack>
					<Text isTruncated bold fontSize="md" noOfLines={2} height={50}>
						{name}
					</Text>
				</VStack>
			</VStack>
		</Card>
	);
};

export default GenreCard;
