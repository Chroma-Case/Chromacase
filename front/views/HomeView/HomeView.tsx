import React from "react";
import { useQuery } from "react-query";
import API from "../../API";
import LoadingComponent from "../../components/Loading";
import { Box, ScrollView, useBreakpointValue, Text, Heading, VStack, Progress, Button, HStack, useTheme } from 'native-base';
import SongCard from "../../components/SongCard";
import { FlatGrid } from 'react-native-super-grid';
import { useNavigation } from "@react-navigation/native";
import SongCardGrid from '../../components/SongCardGrid'

const ProgressBar = ({ xp }: { xp: number}) => {
	const level = Math.floor(xp / 1000);
	const nextLevel = level + 1;
	const nextLevelThreshold = nextLevel * 1000;
	const progessValue = 100 * xp / nextLevelThreshold;
	return <VStack alignItems={'center'}>
		<Text>Niveau {level}</Text>
		<Box w="90%" maxW="400">
			<Progress value={progessValue} mx="4" />
		</Box>
		<Text>{xp} / {nextLevelThreshold} bonnes notes</Text>
	</VStack>
}

const HomeView = () => {
	const theme = useTheme();
	const navigation = useNavigation();
	const screenSize = useBreakpointValue({ base: 'small', md: "big"});
	const flexDirection = useBreakpointValue({ base: 'column', xl: "row"});
	const userQuery = useQuery(['user'], () => API.getUserInfo());
	if (!userQuery.data) {
		return <Box style={{ flexGrow: 1, justifyContent: 'center' }}>
			<LoadingComponent/>
		</Box>
	}
	return <ScrollView>
		<Box style={{ display: 'flex', padding: 30 }}>
			<Box textAlign={ screenSize == 'small' ? 'center' : undefined } style={{ flexDirection, justifyContent: 'center', display: 'flex' }}>
				<Text fontSize="xl" flex={screenSize == 'small' ? 1 : 2}>Bienvenue {userQuery.data.name}!</Text>
				<Box flex={1}>
					<ProgressBar xp={userQuery.data.xp}/>
				</Box>
			</Box>
			<Box paddingY={5} style={{ flexDirection }}>
				<Box flex={2}>
					<SongCardGrid
						heading="Passer à l'étape supérieure"
						songs={[ ...Array(4).keys() ].map(() => ({
							albumCover: "",
							songTitle: "Song",
							artistName: "Artist",
							songId: 1
						}))}
					/>
					<Box style={{ flexDirection }}>
						<Box>
							<SongCardGrid
								heading="Récemment joués"
								songs={[ ...Array(4).keys() ].map(() => ({
									albumCover: "",
									songTitle: "Song",
									artistName: "Artist",
									songId: 1
								}))}
							/>
						</Box>
					</Box>
				</Box>
				<VStack flex={1} space={5}>
					<Box style={{ flexDirection: 'row', justifyContent:'center' }}>
						<Button backgroundColor={theme.colors.secondary[600]} rounded={"full"} size="sm" onPress={() => navigation.navigate('Search')} >Search</Button>
					</Box>
					<SongCardGrid
						maxItemPerRow={screenSize == 'big' ? 2 : undefined}
						heading="Dernieres recherches"
						songs={[ ...Array(4).keys() ].map(() => ({
							albumCover: "",
							songTitle: "Song",
							artistName: "Artist",
							songId: 1
						}))}
					/>
				</VStack>
			</Box>
		</Box>
	</ScrollView>
	
}

export default HomeView;
