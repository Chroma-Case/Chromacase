import React from 'react';
import { Box, VStack, Text } from 'native-base';

type SearchHistoryCardProps = {
    query: string;
    type: string;
    timestamp?: string;
};

const SearchHistoryCard = (props: SearchHistoryCardProps) => {
    const { query, type, timestamp } = props;
    return (
        <Box
            bg="gray.100"
            p={4}
            rounded="md"
            shadow={2}
            height={40}
        >
            <VStack space={2}>
                <Text fontSize="lg" fontWeight="bold">
                    {query ?? "quey"}
                </Text>
                <Text fontSize="lg" fontWeight="semibold">
                    {type ?? "type"}
                </Text>
                <Text color="gray.500">{timestamp ?? "timestamp"}</Text>
            </VStack>
        </Box>
    );
};

export default SearchHistoryCard;