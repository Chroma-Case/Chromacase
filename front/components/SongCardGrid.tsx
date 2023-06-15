import React from 'react';
import SongCard from './SongCard';
import { FlatGrid } from 'react-native-super-grid';
import { Heading, VStack } from 'native-base';

type SongCardGrid = {
	songs: Parameters<typeof SongCard>[0][];
	heading?: JSX.Element;
	maxItemsPerRow?: number;
	style?: Parameters<typeof FlatGrid>[0]['additionalRowStyle'];
};

const SongCardGrid = (props: SongCardGrid) => {
	return (
		<VStack space={5}>
			<Heading>{props.heading}</Heading>
			<FlatGrid
				maxItemsPerRow={props.maxItemsPerRow}
				additionalRowStyle={props.style ?? { justifyContent: 'flex-start' }}
				data={props.songs}
				renderItem={({ item }) => <SongCard {...item} />}
				spacing={10}
			/>
		</VStack>
	);
};

export default SongCardGrid;
