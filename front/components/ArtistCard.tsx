import React from "react";
import Card, { CardBorderRadius } from './Card';
import { VStack, Text, Image } from 'native-base';
import { useNavigation } from "../Navigation";
type ArtistCardProps = {
	image?: string;
	name?: string;
	id?: number;
}

const ArtistCard = (props: ArtistCardProps) => {
	const { image, name, id } = props;
	const navigation = useNavigation();

	return (
		<Card
			shadow={3}
			onPress={() => navigation.navigate('Artist', { artistId: id })}
		>
			<VStack m={1.5} space={3}>
				<Image
					style={{ zIndex: 0, aspectRatio: 1, borderRadius: CardBorderRadius }}
					source={{ uri: image ?? 'https://picsum.photos/200' }}
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
}

export default ArtistCard;