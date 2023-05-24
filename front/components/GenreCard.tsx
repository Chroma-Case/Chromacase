import React from "react";
import Card from './Card';
import { VStack, Text, Box, Icon } from 'native-base';
import { useNavigation } from "../Navigation";
import { useTheme } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import API from "../API";
type GenreCardProps = {
	icon?: string;
	name?: string;
}

const GenreCard = (props: GenreCardProps) => {
	const { icon, name } = props;
	const navigation = useNavigation();
	const theme = useTheme();

	const handlePress = () => {
		API.createSearchHistoryEntry(name ?? 'name', "genre", Date.now());
	}

	return (
		<Card
			shadow={3}
			onPress={handlePress}
		>
			<VStack m={1.5} space={3} alignItems="center">
				<Box
					bg={theme.colors.primary[400]}
					w={20}
					h={20}
					borderRadius="full"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<Icon size={"md"} as={Ionicons} name="musical-notes-outline" />
				</Box>
				<VStack>
					<Text isTruncated bold fontSize="md" noOfLines={2} height={50}>
						{name}
					</Text>
				</VStack>
			</VStack>
		</Card>
	);
}

export default GenreCard;