import React from "react";
import { useQueries, useQuery } from "react-query";
import API from "../API";
import LoadingComponent from "../components/Loading";
import { Box, ScrollView, Flex, useBreakpointValue, Text, VStack, Button, useTheme, Heading, Progress } from 'native-base';
import { useNavigation } from "@react-navigation/native";
import SongCardGrid from '../components/SongCardGrid';
import CompetenciesTable from '../components/CompetenciesTable'
import ProgressBar from "../components/ProgressBar";
import Translate from "../components/Translate";

const HomeView = () => {
	const theme = useTheme();
	const navigation = useNavigation();
	const screenSize = useBreakpointValue({ base: 'small', md: "big"});
	const flexDirection = useBreakpointValue({ base: 'column', xl: "row"});
	const userQuery = useQuery(['user'], () => API.getUserInfo());
	const playHistoryQuery = useQuery(['history', 'play'], () => API.getUserPlayHistory());
	const searchHistoryQuery = useQuery(['history', 'search'], () => API.getSearchHistory());
	const skillsQuery = useQuery(['skills'], () => API.getUserSkills());
	const nextStepQuery = useQuery(['user', 'recommendations'], () => API.getUserRecommendations());
	const artistsQueries = useQueries((playHistoryQuery.data?.concat(searchHistoryQuery.data ?? []).concat(nextStepQuery.data ?? []) ?? []).map((song) => (
		{ queryKey: ['artist', song.id], queryFn: () => API.getArtist(song.id) }
	)));
	if (!userQuery.data || !skillsQuery.data || !searchHistoryQuery.data || !playHistoryQuery.data) {
		return <Box style={{ flexGrow: 1, justifyContent: 'center' }}>
			<LoadingComponent/>
		</Box>
	}
	return <ScrollView>
		<Box style={{ display: 'flex', padding: 30 }}>
			<Box textAlign={ screenSize == 'small' ? 'center' : undefined } style={{ flexDirection, justifyContent: 'center', display: 'flex' }}>
				<Text fontSize="xl" flex={screenSize == 'small' ? 1 : 2}>
					<Translate translationKey="welcome" format={(welcome) => `${welcome} ${userQuery.data.name}!`}/>
				</Text>
				<Box flex={1}>
					<ProgressBar xp={userQuery.data.xp}/>
				</Box>
			</Box>

			<Box paddingY={5} style={{ flexDirection }}>
				<Box flex={2}>
					<SongCardGrid
						heading={<Translate translationKey='goNextStep'/>}
						songs={nextStepQuery.data?.filter((song) => artistsQueries.find((artistQuery) => artistQuery.data?.id === song.artistId))
							.map((song) => ({
								albumCover: song.cover,
								songTitle: song.name,
								songId: song.id,
								artistName: artistsQueries.find((artistQuery) => artistQuery.data?.id === song.artistId)!.data!.name
							})) ?? []
						}
					/>

					<Flex style={{ flexDirection }}>
						<Box flex={1} paddingY={5}>
							<Heading><Translate translationKey='mySkillsToImprove'/></Heading>
							<Box padding={5}>
								<CompetenciesTable {...skillsQuery.data}/>
							</Box>
						</Box>

						<Box flex={1} padding={5}>
							<SongCardGrid
								heading={<Translate translationKey='recentlyPlayed'/>}
								maxItemPerRow={2}
								songs={playHistoryQuery.data?.filter((song) => artistsQueries.find((artistQuery) => artistQuery.data?.id === song.artistId))
									.map((song) => ({
										albumCover: song.cover,
										songTitle: song.name,
										songId: song.id,
										artistName: artistsQueries.find((artistQuery) => artistQuery.data?.id === song.artistId)!.data!.name
									})) ?? []
								}
							/>
						</Box>						
					</Flex>
				</Box>

				<VStack padding={5} flex={1} space={10}>
						<Box style={{flexDirection: 'row'}}>
							
							<Box flex="2" padding={5}>
								<Box style={{ flexDirection: 'row', justifyContent:'center' }}>
									<Button backgroundColor={theme.colors.secondary[600]} rounded={"full"} size="sm" onPress={() => navigation.navigate('Search')} ><Translate translationKey='search'/></Button>
								</Box>
								<SongCardGrid
									maxItemPerRow={2}
									heading={<Translate translationKey='lastSearched'/>}
									songs={searchHistoryQuery.data?.filter((song) => artistsQueries.find((artistQuery) => artistQuery.data?.id === song.artistId))
										.map((song) => ({
											albumCover: song.cover,
											songTitle: song.name,
											songId: song.id,
											artistName: artistsQueries.find((artistQuery) => artistQuery.data?.id === song.artistId)!.data!.name
										})) ?? []
									}
								/>
							</Box>
						</Box>
						<Box style={{ flexDirection: 'row', justifyContent:'center' }}>
							<Button backgroundColor={theme.colors.primary[600]} rounded={"full"} size="sm" onPress={() => navigation.navigate('Settings')} >
								<Translate translationKey='settingsBtn'/>
							</Button>
						</Box>
				</VStack>
			</Box>
		</Box>
	</ScrollView>
	
}

export default HomeView;
