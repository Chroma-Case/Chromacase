import React from 'react';
import { FlatGrid } from 'react-native-super-grid';
import { Heading, VStack } from 'native-base';

type CardGridCustomProps<T> = {
	content: T[];
	heading?: JSX.Element;
	maxItemsPerRow?: number;
	style?: Parameters<typeof FlatGrid>[0]['additionalRowStyle'];
	cardComponent: React.ComponentType<T>;
};

const CardGridCustom = <T extends Record<string, unknown>>(props: CardGridCustomProps<T>) => {
	const { content, heading, maxItemsPerRow, style, cardComponent: CardComponent } = props;

	return (
		<VStack space={5}>
			{heading && <Heading>{heading}</Heading>}
			<FlatGrid
				nestedScrollEnabled
				maxItemsPerRow={maxItemsPerRow}
				additionalRowStyle={style ?? { justifyContent: 'flex-start' }}
				data={content}
				renderItem={({ item }) => <CardComponent {...item} />}
				spacing={10}
			/>
		</VStack>
	);
};

export default CardGridCustom;
