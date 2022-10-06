import React from "react";
import { Box, VStack, Text, AspectRatio, Image } from 'native-base';
type SongCardProps = {
	albumCover: string;
	songTitle: string;
	artistName: string;
}

const SongCard = (props: SongCardProps) => {
	const { albumCover, songTitle, artistName } = props

	return (
		<Box style={{ padding: 5, backgroundColor: '#C5C5C5', flexDirection: 'column', alignContent: 'space-around' }}>
			<Image style={{ zIndex: 0, aspectRatio: 1 }} source={{ uri: "https://i.discogs.com/yHqu3pnLgJq-cVpYNVYu6mE-fbzIrmIRxc6vES5Oi48/rs:fit/g:sm/q:90/h:556/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE2NjQ2/ODUwLTE2MDkwNDU5/NzQtNTkxOS5qcGVn.jpeg" }} alt={[props.songTitle, props.artistName].join('-')} />
			<VStack>
				<Text>
					{songTitle}
				</Text>
				<Text>
					{artistName}
				</Text>
			</VStack>
		</Box>
	);
}

export default SongCard;