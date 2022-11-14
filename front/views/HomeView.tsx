import React from "react";
import { useQueries, useQuery } from "react-query";
import API from "../API";
import LoadingComponent from "../components/Loading";
import { Box, ScrollView, Flex, useBreakpointValue, Text, VStack, Progress, Button, useTheme, Heading } from 'native-base';
import { useNavigation } from "@react-navigation/native";
import SongCardGrid from '../components/SongCardGrid';
import CompetenciesTable from '../components/CompetenciesTable'
import { translate } from "../i18n/i18n";

const ProgressBar = ({ xp }: { xp: number}) => {
	const level = Math.floor(xp / 1000);
	const nextLevel = level + 1;
	const nextLevelThreshold = nextLevel * 1000;
	const progessValue = 100 * xp / nextLevelThreshold;

	return (
		<VStack alignItems={'center'}>
			<Text>{`${translate('level')} ${level}`}</Text>
			<Box w="90%" maxW="400">
				<Progress value={progessValue} mx="4" />
			</Box>
			<Text>{xp} / {nextLevelThreshold} {translate('levelProgress')}</Text>
		</VStack>
	);
}

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
	console.log(userQuery.data);
	return <ScrollView>
		<Box style={{ display: 'flex', padding: 30 }}>
			<Box textAlign={ screenSize == 'small' ? 'center' : undefined } style={{ flexDirection, justifyContent: 'center', display: 'flex' }}>
				<Text fontSize="xl" flex={screenSize == 'small' ? 1 : 2}>{`${translate('welcome')} ${userQuery.data.username}!`} </Text>
				<Box flex={1}>
					<ProgressBar xp={userQuery.data.xp}/>
				</Box>
			</Box>

			<Box paddingY={5} style={{ flexDirection }}>
				<Box flex={2}>
					<SongCardGrid
						heading={translate('goNextStep')}
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
							<Heading>{translate('mySkillsToImprove')}</Heading>
							<Box padding={5}>
								<CompetenciesTable {...skillsQuery.data}/>
							</Box>
						</Box>

						<Box flex={1} padding={5}>
							<SongCardGrid
								heading={translate('recentlyPlayed')}
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
									<Button backgroundColor={theme.colors.secondary[600]} rounded={"full"} size="sm" onPress={() => navigation.navigate('Search')} >{translate('search')}</Button>
								</Box>
								<SongCardGrid
									maxItemPerRow={2}
									heading={translate('lastSearched')}
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
							<Button backgroundColor={theme.colors.primary[600]} rounded={"full"} size="sm" onPress={() => navigation.navigate('Settings')} >{translate('settingsBtn')}</Button>
						</Box>
				</VStack>
			</Box>
		</Box>
	</ScrollView>
	
}

export default HomeView;
