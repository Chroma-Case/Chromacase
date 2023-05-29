import React from "react";
import Card, { CardBorderRadius } from "./Card";
import { VStack, Text, Image } from "native-base";
import API from "../API";

type ArtistCardProps = {
	image: string;
	name: string;
	id: number;
	onPress: () => void;
};

const ArtistCard = (props: ArtistCardProps) => {
	const { image, name, id } = props;

	return (
		<Card shadow={3} onPress={props.onPress}>
			<VStack m={1.5} space={3}>
				<Image
					style={{ zIndex: 0, aspectRatio: 1, borderRadius: CardBorderRadius }}
					source={{ uri: API.getArtistIllustration(id) }}
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

ArtistCard.defaultProps = {
	image: "https://picsum.photos/200",
	name: "Artist",
	id: 0,
	onPress: () => { },
};

export default ArtistCard;
