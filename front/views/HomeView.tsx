import React from "react";
import { useQueries, useQuery } from "react-query";
import API from "../API";
import LoadingComponent from "../components/Loading";
import { Center, Box, ScrollView, Flex, useBreakpointValue, Stack, Heading, Container, VStack, HStack } from 'native-base';
import { useNavigation } from "@react-navigation/native";
import SongCardGrid from '../components/SongCardGrid';
import CompetenciesTable from '../components/CompetenciesTable'
import ProgressBar from "../components/ProgressBar";
import Translate from "../components/Translate";
import TextButton from "../components/TextButton";
import Song from "../models/Song";

const HomeView = () => {
	const navigation = useNavigation();
	const screenSize = useBreakpointValue({ base: 'small', md: "big"});
	const userQuery = useQuery(['user'], () => API.getUserInfo());
	const playHistoryQuery = useQuery(['history', 'play'], () => API.getUserPlayHistory());
	const searchHistoryQuery = useQuery(['history', 'search'], () => API.getSearchHistory());
	const skillsQuery = useQuery(['skills'], () => API.getUserSkills());
	const nextStepQuery = useQuery(['user', 'recommendations'], () => API.getUserRecommendations());
	const songHistory = useQueries(
		playHistoryQuery.data?.map(({ songID }) => ({
			queryKey: ['song', songID],
			queryFn: () => API.getSong(songID)
		})) ?? []
	);
	const artistsQueries = useQueries((songHistory
		.map((entry) => entry.data)
		.concat(nextStepQuery.data ?? [])
		.filter((s): s is Song => s !== undefined))
		.map((song) => (
			{ queryKey: ['artist', song.id], queryFn: () => API.getArtist(song.id) }
		))
	);

	if (!userQuery.data || !skillsQuery.data || !searchHistoryQuery.data || !playHistoryQuery.data) {
		return <Center style={{ flexGrow: 1 }}>
			<LoadingComponent/>
		</Center>
	}
	return <ScrollView p={10}>
		<Flex>
			<Stack space={4}
				display={{ base: 'block', md: 'flex' }}
				direction={{ base: 'column', md: 'row' }}
				textAlign={{ base: 'center', md: 'inherit' }}
				justifyContent="space-evenly"
			>
				<Translate fontSize="xl" flex={2}
					translationKey="welcome" format={(welcome) => `${welcome} ${userQuery.data.name}!`}
				/>
				<Box flex={1}>
					<ProgressBar xp={userQuery.data.xp}/>
				</Box>
			</Stack>
		</Flex>
		<Stack direction={{ base: 'column', lg: 'row' }} height="100%" space={5} paddingTop={5}>
			<VStack flex={{ lg: 2 }} space={5}>
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
				<Stack direction={{ base: 'column', lg: 'row' }}>
					<Box flex={{ md: 1 }}>
						<Heading><Translate translationKey='mySkillsToImprove'/></Heading>
						<Box padding={5}>
							<CompetenciesTable {...skillsQuery.data}/>
						</Box>
					</Box>
					<Box flex={{ md: 1 }}>
						<SongCardGrid
							heading={<Translate translationKey='recentlyPlayed'/>}
							songs={songHistory
								.filter((songQuery) => songQuery.data)
								.map(({ data }) => data)
								.filter((song, i, array) => array.map((s) => s.id).findIndex((id) => id == song.id) == i)
								.filter((song) => artistsQueries.find((artistQuery) => artistQuery.data?.id === song.artistId))
								.map((song) => ({
									albumCover: song.cover,
									songTitle: song.name,
									songId: song.id,
									artistName: artistsQueries.find((artistQuery) => artistQuery.data?.id === song.artistId)!.data!.name
								})) ?? []
							}
						/>
					</Box>	
				</Stack>
			</VStack>
			<VStack flex={{ lg: 1 }} height={{ lg: '100%' }}  alignItems="center">
				<HStack width="100%" justifyContent="space-evenly" p={5} space={5}>
					<TextButton
						translate={{ translationKey: 'searchBtn' }}
						colorScheme='secondary' size="sm"
						onPress={() => navigation.navigate('Search')}
					/>
					<TextButton translate={{ translationKey: 'settingsBtn' }}
						colorScheme='gray'  size="sm"
						onPress={() => navigation.navigate('Settings')} 
					/>
				</HStack>
				<Box style={{ width: '100%' }}>
					<SongCardGrid
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
			</VStack>
		</Stack>

	</ScrollView>
	
}

export default HomeView;
