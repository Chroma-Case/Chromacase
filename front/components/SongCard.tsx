import React from "react";
import Card, { CardBorderRadius } from './Card';
import { VStack, Text, Image, Pressable } from 'native-base';
import { useNavigation } from "@react-navigation/core";
type SongCardProps = {
	albumCover: string;
	songTitle: string;
	artistName: string;
	songId: number
}

const SongCard = (props: SongCardProps) => {
	const { albumCover, songTitle, artistName, songId } = props;
	const navigation = useNavigation();
	return (
		<Card
			shadow={3}
			flexDirection='column'
			alignContent='space-around'
			onPress={() => navigation.navigate('Song', { songId })}
		>
			<Image
				style={{ zIndex: 0, aspectRatio: 1, margin: 5, borderRadius: CardBorderRadius}}
				source={{ uri: albumCover }}
				alt={[props.songTitle, props.artistName].join('-')}
			/>
			<VStack padding={3}>
				<Text bold fontSize='md'>
					{songTitle}
				</Text>
				<Text>
					{artistName}
				</Text>
			</VStack>
		</Card>
	)
}

export default SongCard;