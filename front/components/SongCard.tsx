import React from 'react';
import Card, { CardBorderRadius } from './Card';
import { VStack, Text, Image } from 'native-base';
import { useNavigation } from '../Navigation';
import API from '../API';
type SongCardProps = {
	cover: string;
	name: string;
	artistName: string;
	songId: number;
};

const SongCard = (props: SongCardProps) => {
	const { cover, name, artistName, songId } = props;
	const navigation = useNavigation();
	return (
		<Card shadow={3} onPress={() => navigation.navigate('Song', { songId })}>
			<VStack m={1.5} space={3}>
				<Image
					style={{ zIndex: 0, aspectRatio: 1, borderRadius: CardBorderRadius }}
					source={{ uri: cover }}
					alt={[props.name, props.artistName].join('-')}
				/>
				<VStack>
					<Text isTruncated bold fontSize="md" noOfLines={2} height={50}>
						{name}
					</Text>
					<Text isTruncated>{artistName}</Text>
				</VStack>
			</VStack>
		</Card>
	);
};

export default SongCard;
