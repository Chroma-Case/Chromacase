import React from 'react';
import SongCard from './SongCard';
import { FlatGrid } from 'react-native-super-grid';
import { Heading, VStack } from 'native-base';

type SongCardGrid = {
	songs: Parameters<typeof SongCard>[0][];
	maxItemsPerRow?: number,
	itemDimension?: number,
	heading?: JSX.Element,
}

const SongCardGrid = (props: SongCardGrid) => {
	return <VStack>
		<Heading>{props.heading}</Heading>
		<FlatGrid
			maxItemsPerRow={props.maxItemsPerRow}
			itemDimension={props.itemDimension ?? (props.maxItemsPerRow ? undefined : 150)}
			additionalRowStyle={{ justifyContent: 'flex-start' }}
			data={props.songs}
			renderItem={({ item }) => <SongCard {...item} /> }
			spacing={10}
		/>
	</VStack>
}

export default SongCardGrid;