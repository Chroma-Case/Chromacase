import React from "react";
import { useQuery } from "react-query";
import API from "../API";
import LoadingComponent from "../components/Loading";
import { Box, ScrollView, Flex, useBreakpointValue, Text, VStack, Progress, Button, useTheme, Heading } from 'native-base';
import { useNavigation } from "@react-navigation/native";
import SongCardGrid from '../components/SongCardGrid';
import CompetenciesTable from '../components/CompetenciesTable'
import { translate } from "../i18n/i18n";
import { Pressable, Image } from "native-base";
import Card from "../components/Card";

const ProgressBar = ({ xp }: { xp: number}) => {
	const level = Math.floor(xp / 1000);
	const nextLevel = level + 1;
	const nextLevelThreshold = nextLevel * 1000;
	const progessValue = 100 * xp / nextLevelThreshold;
	const nav = useNavigation();
	const flexDirection = useBreakpointValue({ base: 'column', xl: "row"});

	return (
		<Pressable onPress={() => nav.navigate('User')}>
		{({ isHovered,  isFocused }) => (
			<Card w="90%" maxW='500' style={{ flexDirection, justifyContent: 'center'}} 
				  bg={(isHovered || isFocused) ? 'coolGray.200' : undefined }>
				<Box w="20%" paddingRight={2} >
					<Image borderRadius={100} source={{
      					uri: "https://wallpaperaccess.com/full/317501.jpg"
    				}} alt="Profile picture" size="sm"/>
				</Box>
				<VStack alignItems={'center'}>
					<Text>{`${translate('level')} ${level}`}</Text>
					<Box w="100%">
						<Progress value={progessValue} mx="4" />
					</Box>
					<Text>{xp} / {nextLevelThreshold} {translate('levelProgress')}</Text>
				</VStack>
			</Card>
		)}
		</Pressable>
	);
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
				<Text fontSize="xl" flex={screenSize == 'small' ? 1 : 2}>{`${translate('welcome')} ${userQuery.data.name}!`} </Text>
				<Box flex={1}>
					<ProgressBar xp={userQuery.data.xp}/>
				</Box>
			</Box>

			<Box paddingY={5} style={{ flexDirection }}>
				<Box flex={2}>
					<SongCardGrid
						heading={translate('goNextStep')}
						songs={[ ...Array(4).keys() ].map(() => ({
							albumCover: "",
							songTitle: "Song",
							artistName: "Artist",
							songId: 1
						}))}
					/>

					<Flex style={{ flexDirection }}>
						<Box flex={1} paddingY={5}>
							<Heading>{translate('mySkillsToImprove')}</Heading>
							<Box padding={5}>
								<CompetenciesTable
									pedalsCompetency=	{Math.random() * 100}
									rightHandCompetency={Math.random() * 100}
									leftHandCompetency=	{Math.random() * 100}
									accuracyCompetency=	{Math.random() * 100}
									arpegeCompetency=	{Math.random() * 100}
									chordsCompetency=	{Math.random() * 100}
								/>
							</Box>
						</Box>

						<Box flex={1} padding={5}>
							<SongCardGrid
								heading={translate('recentlyPlayed')}
								maxItemPerRow={2}
								songs={[ ...Array(4).keys() ].map(() => ({
									albumCover: "",
									songTitle: "Song",
									artistName: "Artist",
									songId: 1
								}))}
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
									songs={[ ...Array(4).keys() ].map(() => ({
										albumCover: "",
										songTitle: "Song",
										artistName: "Artist",
										songId: 1
									}))}
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
