import React from 'react';
import { useQuery } from '../Queries';
import API from '../API';
import { LoadingView } from '../components/Loading';
import { Box, Flex, Stack, Heading, VStack, HStack } from 'native-base';
import { RouteProps, useNavigation } from '../Navigation';
import SongCardGrid from '../components/SongCardGrid';
import CompetenciesTable from '../components/CompetenciesTable';
import Translate from '../components/Translate';
import TextButton from '../components/TextButton';
import { FontAwesome5 } from '@expo/vector-icons';
import ScaffoldCC from '../components/UI/ScaffoldCC';

// eslint-disable-next-line @typescript-eslint/ban-types
const HomeView = (props: RouteProps<{}>) => {
	const navigation = useNavigation();
	const userQuery = useQuery(API.getUserInfo);
	const playHistoryQuery = useQuery(API.getUserPlayHistory(['artist']));
	const searchHistoryQuery = useQuery(API.getSearchHistory(0, 10));
	const skillsQuery = useQuery(API.getUserSkills);
	const nextStepQuery = useQuery(API.getSongSuggestions(['artist']));

	if (
		!userQuery.data ||
		!skillsQuery.data ||
		!searchHistoryQuery.data ||
		!playHistoryQuery.data
	) {
		return <LoadingView />;
	}
	return (
		<ScaffoldCC routeName={props.route.name}>
			<Stack direction={{ base: 'column', lg: 'row' }} space={5} paddingTop={5}>
				<VStack flex={{ lg: 2 }} space={5}>
					<SongCardGrid
						heading={<Translate translationKey="goNextStep" />}
						songs={
							nextStepQuery.data?.map((song) => ({
								cover: song.cover,
								name: song.name,
								songId: song.id,
								artistName: song.artist!.name,
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
									playHistoryQuery.data
										?.map((x) => x.song)
										.map((song) => ({
											cover: song.cover,
											name: song.name,
											songId: song.id,
											artistName: song.artist!.name,
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
							onPress={() => navigation.navigate('Settings', {})}
						/>
						<TextButton
							label={'V2'}
							colorScheme="gray"
							size="sm"
							onPress={() => navigation.navigate('HomeNew', {})}
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
		</ScaffoldCC>
	);
};

export default HomeView;
