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
import PhaserCanvas from '../components/PartitionVisualizer/PhaserCanvas';

const b64data =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAGKDAGaAAAFgUlEQVRYw7WXa2wUVRTH/20p7fZBW0p5iAplaUELCqEFlUCMYKwJKMYgaEwIUpQYNCIWRYgvQtTS6AeiKEqIQDBIAEFAEEm1DUVUoIqPVqhCC/IoammhC9vt/vywM7szu7NLLfHMl7n3nP/533vuPefMSHap8wNIoG57pxIYSErZDyCgB8qogTYUeKT+v2C+SlLanqA3v4EBwSdAasAI4CUUcA7wRsiBMbDIjQDQd4M0ogimtkrbMWSgAVzibUIouTIwfc4kJaVIkpT+PTxLiGplkHCo6Wq+uSOydlrYl3jD1xOSAQ5zdzcA1CJJK/ygOEk91kIhAMsQmeMDq9MRg7ojGExIINkrOAm8D4DHSg9QwiQApiDmeQzFWaDE2LUQ4DXjedimsAQaShgbqXj4NM4ISZpmVeTbdt6vGISrWtElfs76Fuig9+9hij7qFjbTs6GecEnxSdKa4DjbK0nFrzWFTI4yE/jVsvDsMaauP0JxX0ARviBgOg0A3GnZaVpO4N3llZRYYZrez8dhC/KRxrBVYSt37TPVgSh6GQN8FFxSQPLOqbsBSP3Wy2gLwJIRQcC91mPIOGyaTaTKARBxbllH7EtqZkJsgCRlvrTbF21JQiS3KN7pkFNH/BMOiJ+nq8vQTTNI8ChZnZabXJs7bxzf9zjAO/8kTLfNxynXwTpze6PlnG8/o16B+fzTfqCRgq1W62nXtYff1X1orjRiqzn2M8TgySlqAFjNuqDxFdIRKpWeag/Vo7zfJWXXei1ep3AaKDYDWypNvhLQnETk1+kWf/hC3iUrdGil0i3lAE8iRM/r1cpm3g0aNzAdgB8sACnvm8Bo0AuSLgLwKMeBQjosTEuCAJu0BSPgjsjo5WS0KyUM4Amqf6aO2cFRPUKU0cLAOhvgsgUAUM4u/PQz9lAGwC5/75eDgFlhAHuxKzNmynGtMwDtvMWOmIBahEjbYAACBWYCzY6A18kx3jI2WXolQJvRKMLqb6g5bbO0AnMPlbwSFdBrpwMA4FkOOwJ6mw08q/J8jChZnhtCR9HdfTo2IP6JyGQrfKbVGZBeETWdB723PwzQ/ZISr1IDchs9IcCtnasbWWMvCC3SNUhm2ophJ2raq9pyjycvjbju1yTje/604IzHllMXmH0256BGRBoPTipaO/jv4ktTPaNaC+rd02I5dqUsdTdUXiaGfOYbdKbPi2bnLkjLO3cszGJx+00fRLoemXlg1qkLVDOOxVyM6v4MM4kLlpQh6cObI22OIcatNh0nJj3X/8S2S3aTFhZwJ9/Z5raTZ71npZKUOWVxhPtDuBD5jZI7c+8DJ8/Giga7GcObzCMxMkFKJWlUYm6ztU0cYbihH7lccbv3cw9z+Tuq+yrG8gptNDGHBEcCSXGDjz7NDG6zWQyYLylhTyDSl1nK7VRYHLfxKmOpjCDcaH5dR5T1obPddekel9f95/BPs/ubwa+wB76acTzPRJ6hOWbYGnkEEb/wqlc96eu2CHAJ1cznLg5Fdf8lBQjxBqv87qbcx2MQJFd5HAjMyrSD0bxN6ABbWUiSQ9f4jQnNA7epjwNBSvWVGATmrX+M+xjjUGbLbHbtLLvU7w/dYf/0OrCV0ZTjjUEQ/WOxzJYh+QiRut5GkP6dz/jBms0kartA0ByWIekbbQQ9DnXYHG2gkIJOE7gc5jK32AgyavwOZ/A504N/AjG/px2entvtxf5Hoh5yByspZMN/JMjZbQ/RwRrf1W5RLZMY3Pkd7Ii8q5N71y9rae/CLbI/PY5qfKyk7ttvy13nj3aBIN6XslwZnW2TcX1KMlre8vk7RZB6QsVd7ccD3dUPXTwVhSCuI+lD80fi2iQhb1H+X5ssBEmn9KD+B7k54yut0XX/HfgvpUkmTvPggOsAAAAASUVORK5CYII=';


const HomeView = () => {
	// return <PhaserCanvas partitionB64={b64data} />;
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
