import React from "react";
import Card, { CardBorderRadius } from './Card';
import { VStack, Text, Image, Pressable, Box, Icon } from 'native-base';
import { useNavigation } from "../Navigation";
import { useTheme } from "native-base";
import { Ionicons } from "@expo/vector-icons";
type GenreCardProps = {
	icon?: string;
	name?: string;
}

const GenreCard = (props: GenreCardProps) => {
	const { icon, name } = props;
	const navigation = useNavigation();
	const theme = useTheme();

	return (
		<Card shadow={3}>
			<VStack m={1.5} space={3} alignItems="center"> {/* Set alignItems="center" to center the items horizontally */}
				<Box
					bg={theme.colors.primary[400]}
					w={20}
					h={20}
					borderRadius="full"
					display="flex" /* Add display="flex" to enable flexbox layout */
					alignItems="center" /* Center the icon vertically */
					justifyContent="center" /* Center the icon horizontally */
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