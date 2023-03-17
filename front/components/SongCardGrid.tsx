import React from 'react';
import SongCard from './SongCard';
import { FlatGrid } from 'react-native-super-grid';
import { Heading, VStack } from 'native-base';
import { RequireExactlyOne } from 'type-fest';

type SongCardGrid = {
	songs: Parameters<typeof SongCard>[0][];
	heading?: JSX.Element,
} & RequireExactlyOne<{
	maxItemsPerRow: number,
	itemDimension: number,
}>

const SongCardGrid = (props: SongCardGrid) => {
	return <VStack space={5}>
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