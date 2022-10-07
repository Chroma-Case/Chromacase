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
	return <Pressable onPress={() => navigation.navigate('Song', { songId })}>
		{({ isHovered,  isFocused }) => (
		<Card
			shadow={3}
			flexDirection='column'
			alignContent='space-around'
			bg={(isHovered || isFocused) ? 'coolGray.200' : undefined }
		>
			<Image
				style={{ zIndex: 0, aspectRatio: 1, margin: 5, borderRadius: CardBorderRadius}}
				source={{ uri: "https://i.discogs.com/yHqu3pnLgJq-cVpYNVYu6mE-fbzIrmIRxc6vES5Oi48/rs:fit/g:sm/q:90/h:556/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE2NjQ2/ODUwLTE2MDkwNDU5/NzQtNTkxOS5qcGVn.jpeg" }}
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
		)}
	</Pressable>
}

export default SongCard;