import React from 'react';
import Card, { CardBorderRadius } from './Card';
import { VStack, Text, Image } from 'native-base';

type ArtistCardProps = {
	image?: string;
	name: string;
	id: number;
	onPress: () => void;
};

const ArtistCard = (props: ArtistCardProps) => {
	const { image, name } = props;

	return (
		<Card shadow={3} onPress={props.onPress}>
			<VStack m={1.5} space={3}>
				<Image
					style={{ zIndex: 0, aspectRatio: 1, borderRadius: CardBorderRadius }}
					source={{ uri: image }}
					fallbackSource={{ uri: require('../assets/icon.jpg') }}
					alt={name}
				/>
				<VStack>
					<Text isTruncated bold fontSize="md" noOfLines={2} height={50}>
						{name}
					</Text>
				</VStack>
			</VStack>
		</Card>
	);
};

export default ArtistCard;
