import React from "react";
import { Box, VStack, Text, AspectRatio, Image, useTheme, Pressable } from 'native-base';
import { useNavigation } from "@react-navigation/core";
type SongCardProps = {
	albumCover: string;
	songTitle: string;
	artistName: string;
	songId: number
}

const borderRadius = 10;

const cardBorder = (theme: ReturnType<typeof useTheme>) => ({
	borderColor: theme.colors.text[100],
	borderRadius,
	borderWidth: 1 
})

const SongCard = (props: SongCardProps) => {
	const { albumCover, songTitle, artistName, songId } = props;
	const navigation = useNavigation();
	const theme = useTheme();
	return <Pressable onPress={() => navigation.navigate('Song', { songId })}>
		{({ isHovered,  isFocused }) => (
		<Box
			flexDirection='column'
			alignContent='space-around'
			bg={(isHovered || isFocused) ? 'coolGray.200' : undefined }
			style={ cardBorder(theme) }
		>
			<Image
				style={{ zIndex: 0, aspectRatio: 1, margin: 5, borderRadius}}
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
		</Box>
		)}
	</Pressable>
}

export default SongCard;