import React from 'react';
import { useQueries, useQuery } from '../Queries';
import API from '../API';
import { LoadingView } from '../components/Loading';
import { Box, ScrollView, Flex, Stack, Heading, VStack, HStack } from 'native-base';
import { useNavigation } from '../Navigation';
import SongCardGrid from '../components/SongCardGrid';
import CompetenciesTable from '../components/CompetenciesTable';
import ProgressBar from '../components/ProgressBar';
import Translate from '../components/Translate';
import TextButton from '../components/TextButton';
import Song from '../models/Song';
import { FontAwesome5 } from '@expo/vector-icons';

const HomeView = () => {
	const navigation = useNavigation();
	const userQuery = useQuery(API.getUserInfo);
	const playHistoryQuery = useQuery(API.getUserPlayHistory);
	const searchHistoryQuery = useQuery(API.getSearchHistory(0, 10));
	const skillsQuery = useQuery(API.getUserSkills);
	const nextStepQuery = useQuery(API.getSongSuggestions);
	const songHistory = useQueries(
		playHistoryQuery.data?.map(({ songID }) => API.getSong(songID)) ?? []
	);
	const artistsQueries = useQueries(
		songHistory
			.map((entry) => entry.data)
			.concat(nextStepQuery.data ?? [])
			.filter((s): s is Song => s !== undefined)
			.map((song) => API.getArtist(song.artistId))
	);

	if (
		!userQuery.data ||
		!skillsQuery.data ||
		!searchHistoryQuery.data ||
		!playHistoryQuery.data
	) {
		return <LoadingView />;
	}
	return (
		<ScrollView p={10}>
			<Flex>
				<Stack
					space={4}
					display={{ base: 'block', md: 'flex' }}
					direction={{ base: 'column', md: 'row' }}
					textAlign={{ base: 'center', md: 'inherit' }}
					justifyContent="space-evenly"
				>
					<Translate
						fontSize="xl"
						flex={2}
						translationKey="welcome"
						format={(welcome) => `${welcome} ${userQuery.data.name}!`}
					/>
					<Box flex={1}>
						<ProgressBar xp={userQuery.data.data.xp} />
					</Box>
				</Stack>
			</Flex>
			<Stack direction={{ base: 'column', lg: 'row' }} height="100%" space={5} paddingTop={5}>
				<VStack flex={{ lg: 2 }} space={5}>
					<SongCardGrid
						heading={<Translate translationKey="goNextStep" />}
						songs={
							nextStepQuery.data
								?.filter((song) =>
									artistsQueries.find(
										(artistQuery) => artistQuery.data?.id === song.artistId
									)
								)
								.map((song) => ({
									cover: song.cover,
									name: song.name,
									songId: song.id,
									artistName: artistsQueries.find(
										(artistQuery) => artistQuery.data?.id === song.artistId
									)!.data!.name,
								})) ?? []
						}
					/>
					<Stack direction={{ base: 'column', lg: 'row' }}>
						<Box flex={{ lg: 1 }}>
							<Heading>
								<Translate translationKey="mySkillsToImprove" />
							</Heading>
							<Box padding={5}>
								<CompetenciesTable {...skillsQuery.data} />
							</Box>
						</Box>
						<Box flex={{ lg: 1 }}>
							<SongCardGrid
								heading={<Translate translationKey="recentlyPlayed" />}
								songs={
									songHistory
										.map(({ data }) => data)
										.filter((data): data is Song => data !== undefined)
										.filter(
											(song, i, array) =>
												array
													.map((s) => s.id)
													.findIndex((id) => id == song.id) == i
										)
										.filter((song) =>
											artistsQueries.find(
												(artistQuery) =>
													artistQuery.data?.id === song.artistId
											)
										)
										.map((song) => ({
											cover: song.cover,
											name: song.name,
											songId: song.id,
											artistName: artistsQueries.find(
												(artistQuery) =>
													artistQuery.data?.id === song.artistId
											)!.data!.name,
										})) ?? []
								}
							/>
						</Box>
					</Stack>
				</VStack>
				<VStack flex={{ lg: 1 }} height={{ lg: '100%' }} alignItems="center">
					<HStack width="100%" justifyContent="space-evenly" p={5} space={5}>
						<TextButton
							translate={{ translationKey: 'searchBtn' }}
							colorScheme="secondary"
							size="sm"
							onPress={() => navigation.navigate('Search', {})}
						/>
						<TextButton
							translate={{ translationKey: 'settingsBtn' }}
							colorScheme="gray"
							size="sm"
							onPress={() => navigation.navigate('Settings')}
						/>
						<TextButton
							label={'V2'}
							colorScheme="gray"
							size="sm"
							onPress={() => navigation.navigate('HomeNew')}
						/>
					</HStack>
					<Box style={{ width: '100%' }}>
						<Heading>
							<Translate translationKey="recentSearches" />
						</Heading>
						<Flex
							padding={3}
							style={{
								width: '100%',
								alignItems: 'flex-start',
								alignContent: 'flex-start',
								flexDirection: 'row',
								flexWrap: 'wrap',
							}}
						>
							{searchHistoryQuery.data?.length === 0 && (
								<Translate translationKey="noRecentSearches" />
							)}
							{[...new Set(searchHistoryQuery.data.map((x) => x.query))]
								.slice(0, 5)
								.map((query) => (
									<TextButton
										leftIcon={<FontAwesome5 name="search" size={16} />}
										style={{
											margin: 2,
										}}
										key={query}
										variant="solid"
										size="xs"
										colorScheme="primary"
										label={query}
										onPress={() =>
											navigation.navigate('Search', { query: query })
										}
									/>
								))}
						</Flex>
					</Box>
				</VStack>
			</Stack>
		</ScrollView>
	);
};

export default HomeView;
