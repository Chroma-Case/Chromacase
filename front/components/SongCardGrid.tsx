import React from 'react';
import SongCard from './SongCard';
import { FlatGrid } from 'react-native-super-grid';
import { Heading, VStack } from 'native-base';

type SongCardGrid = {
	songs: Parameters<typeof SongCard>[0][];
	maxItemPerRow?: number,
	heading?: JSX.Element,
}

const SongCardGrid = (props: SongCardGrid) => {
	return <VStack>
		<Heading>{props.heading}</Heading>
		<FlatGrid
			maxItemsPerRow={props.maxItemPerRow ?? 5}
			additionalRowStyle={{ justifyContent: 'space-between' }}
			data={props.songs}
			renderItem={({ item }) => <SongCard {...item} /> }
			spacing={20}
		/>
	</VStack>
}

export default SongCardGrid;