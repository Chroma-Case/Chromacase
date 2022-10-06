import React from "react";
import { useQuery } from "react-query";
import API from "../../API";
import LoadingComponent from "../../components/Loading";
import { Box, ScrollView, useBreakpointValue, Text, VStack, Progress, Button, HStack } from 'native-base';
import SongCard from "../../components/SongCard";
import { FlatGrid } from 'react-native-super-grid';

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
	const flexDirection = useBreakpointValue({ base: 'column', xl: "row"});
	const userQuery = useQuery(['user'], () => API.getUserInfo());
	if (!userQuery.data) {
		return <Box style={{ flexGrow: 1, justifyContent: 'center' }}>
			<LoadingComponent/>
		</Box>
	}
	return <ScrollView>
		<Box style={{ display: 'flex', padding: 10 }}>
			<Box textAlign={ flexDirection == 'column' ? 'center' : undefined } style={{ flexDirection, justifyContent: 'center', display: 'flex' }}>
				<Text fontSize="xl" flex={1}>Bienvenue {userQuery.data.name}!</Text>
				<Box flex={1}>
					<ProgressBar xp={userQuery.data.xp}/>
				</Box>
			</Box>
			<Box style={{ flexDirection }}>
				<Box flex={1}>
					<Text fontSize="md">Passer à l'étape supérieure</Text>
					<FlatGrid	
						data={[ ...Array(4).keys() ]}
						renderItem={({ item }) =>
							<SongCard albumCover={"https://meelo.arthichaud.me/api/illustrations/releases/120"} songTitle={"Song"} artistName={"Artist"}/>
						}
						spacing={20}
					/>
				</Box>
				<VStack flex={1} >
					<Box style={{ flexDirection: 'row', justifyContent:'center' }}>
						<Button size="sm">Search</Button>

					</Box>
				</VStack>
			</Box>
		</Box>
	</ScrollView>
	
}

export default HomeView;
