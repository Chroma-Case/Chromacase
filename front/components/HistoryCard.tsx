import React from 'react';
import { VStack, Text } from 'native-base';
import Card from './Card';

type SearchHistoryCardProps = {
	query: string;
	type: string;
	timestamp?: string;
};

const SearchHistoryCard = (props: SearchHistoryCardProps & { onPress: (query: string) => void }) => {
	const { query, type, timestamp, onPress } = props;

	const handlePress = () => {
		if (onPress) {
			onPress(query);
		}
	};

	return (
		<Card shadow={2} onPress={handlePress} >
			<VStack m={1.5} space={3}>
				<Text fontSize="lg" fontWeight="bold">
					{query ?? "query"}
				</Text>
				<Text fontSize="lg" fontWeight="semibold">
					{type ?? "type"}
				</Text>
				<Text color="gray.500">{timestamp ?? "timestamp"}</Text>
			</VStack>
		</Card>
	);
};

export default SearchHistoryCard;