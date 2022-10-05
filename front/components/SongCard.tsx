import React from "react";
import { View } from "react-native";
import { Card, Text, Title } from "react-native-paper";

type SongCardProps = {
	albumCover: string;
	songTitle: string;
	artistName: string;
}

const SongCard = (props: SongCardProps) => {
	const { albumCover, songTitle, artistName } = props

	return (
		<View style={{ flexGrow: 0, flexShrink: 1 }}>
			<Card style={{ padding: 5, backgroundColor: '#C5C5C5', zIndex: 0 }}>
				<Card.Cover source={{ uri: albumCover }} style={{ aspectRatio: 1, zIndex: 0 }} />
				<Card.Content style={{ zIndex: 0 }}>
					<Title>
						{songTitle}
					</Title>
					<Text>
						{artistName}
					</Text>
				</Card.Content>
			</Card>
		</View>
	);
}

export default SongCard;