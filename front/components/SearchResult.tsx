import React, { useEffect, useState } from "react";
import {
	HStack,
	VStack,
	Heading,
	Text,
	Pressable,
	Box,
	Card,
	Image,
	Flex,
	useBreakpointValue,
	Column,
	ScrollView} from "native-base";
import { SafeAreaView, useColorScheme } from "react-native";
import { SettingsState } from '../state/SettingsSlice';
import { RootState } from '../state/Store';
import { useSelector } from "react-redux";
import { SearchContext } from "../views/SearchView";
import { useQuery } from "react-query";
import { translate } from "../i18n/i18n";
import { useNavigation } from "@react-navigation/native";
import API from "../API";
import LoadingComponent from "./Loading";
import ArtistCard from "./ArtistCard";
import GenreCard from "./GenreCard";
import SongCard from "./SongCard";
import CardGridCustom from "./CardGridCustom";
import TextButton from "./TextButton";
import SearchHistoryCard from "./HistoryCard";
import Song from "../models/Song";

const RowCustom = (props: Parameters<typeof Box>[0]) => {
	const colorScheme: SettingsState['colorScheme'] = useSelector((state: RootState) => state.settings.settings.colorScheme);
	const systemColorMode = useColorScheme();

	return <Pressable>
		{({ isHovered, isPressed }) => (
		<Box {...props} style={{ ...(props.style ?? {}) }}
			py={3}
			my={1}
			bg={(colorScheme == 'system' ? systemColorMode : colorScheme) == 'dark'
				? (isHovered || isPressed) ? 'gray.800' : undefined
				: (isHovered || isPressed) ? 'coolGray.200' : undefined
			}
		>
			{ props.children }
		</Box>
		)}
	</Pressable>
}

const SongRow = (props: Song) => {
	const navigation = useNavigation();

	return (
		<RowCustom>
				<HStack px={2} space={5}>
					<Image
						pl={10}
						style={{ zIndex: 0, aspectRatio: 1, borderRadius: 5 }}
						source={{ uri: props.cover ?? 'https://picsum.photos/200' }}
						alt={props.name}
					/>
					<HStack style={{display: 'flex', alignItems: 'center'}} space={6}>
						<Text pl={10} bold fontSize='md'>{props.name}</Text>
						<Text fontSize={"sm"}>{props.artistId ?? 'artist'}</Text>
					</HStack>
					<TextButton
						translate={{ translationKey: 'playBtn' }}
						colorScheme='primary' variant={"outline"} size='sm'
						onPress={() => navigation.navigate('Song', { songId: props.id })}
					/>
				</HStack>
		</RowCustom>
	);
}

const HomeSearchComponent = () => {
	const {isLoading: isLoadingHistory, data: historyData = []} = useQuery(
			'history',
			() => API.getSearchHistory(0, 12),
			{ enabled: true },
		);

	const {isLoading: isLoadingSuggestions, data: suggestionsData = []} = useQuery(
			'suggestions',
			() => API.getSongSuggestions(),
			{ enabled: true },
		);

	return (
		<VStack mt="5" style={{overflow: 'hidden'}}>
			<Card shadow={3} mb={5}>
				<Heading margin={5}>{translate('lastSearched')}</Heading>
				{ isLoadingHistory ? <LoadingComponent/> : <CardGridCustom content={historyData} cardComponent={SearchHistoryCard}/> }
			</Card>
			<Card shadow={3} mt={5} mb={5}>
				<Heading margin={5}>{translate('songsToGetBetter')}</Heading>
				{ isLoadingSuggestions ? <LoadingComponent/> : <CardGridCustom content={suggestionsData} cardComponent={SongCard}/> }
			</Card>
		</VStack>
	);
}

const SongsSearchComponent = (props: any) => {
	const {songData} = React.useContext(SearchContext);

	return (
			<ScrollView>
				<Text fontSize="xl" fontWeight="bold" mt={4}>
					{translate('songsFilter')}
				</Text>
				{songData?.length ? (
					songData.slice(0, props.maxRows).map((comp, index) => (
						<SongRow
							key={index}
							name={comp.name}
							albumId={comp.albumId}
							artistId={comp.artistId}
							cover={comp.cover}
							details={comp.details}
							genreId={comp.genreId}
							id={comp.id}
						/>
					))
				) : (
					<Text>{translate('errNoResults')}</Text>
				)}
			</ScrollView>
	);
}

const ArtistSearchComponent = (props: any) => {
	const {artistData} = React.useContext(SearchContext);

	return (
		<Box>
			<Text fontSize="xl" fontWeight="bold" mt={4}>
				{translate('artistFilter')}
			</Text>
			{ artistData?.length
			? <CardGridCustom content={!props?.maxItems ? artistData : artistData.slice(0, props.maxItems)} cardComponent={ArtistCard} />
			: <Text>{translate('errNoResults')}</Text> }
		</Box>
	);
}

const GenreSearchComponent = (props: any) => {
	const {genreData} = React.useContext(SearchContext);

	return (
		<Box>
			<Text fontSize="xl" fontWeight="bold" mt={4}>
				{translate('genreFilter')}
			</Text>
			{ genreData?.length
			? <CardGridCustom content={!props?.maxItems ? genreData : genreData.slice(0, props.maxItems)} cardComponent={GenreCard}/>
			: <Text>{translate('errNoResults')}</Text> }
		</Box>
	);
}

const AllComponent = () => {
	const screenSize = useBreakpointValue({ base: "small", md: "big" });
	const isMobileView = screenSize == "small";

	return (
		<SafeAreaView>
			<Flex flexWrap="wrap" direction={isMobileView ? 'column' : 'row'} justifyContent={['flex-start']} mt={4}>
				<Column w={isMobileView ? '100%' : '50%'}>
					<Box minH={isMobileView ? 100 : 200}>
						<ArtistSearchComponent maxItems={6}/>
					</Box>
					<Box minH={isMobileView ? 100 : 200}>
						<GenreSearchComponent maxItems={6}/>
					</Box>
				</Column>
				<Box w={isMobileView ? '100%' : '50%'}>
					<SongsSearchComponent maxRows={9}/>
				</Box>
			</Flex>
		</SafeAreaView>
	);
}

const FilterSwitch = () => {
	const { filter } = React.useContext(SearchContext);
	const [currentFilter, setCurrentFilter] = React.useState(filter);

	React.useEffect(() => {
		setCurrentFilter(filter);
	}, [filter]);

	switch (currentFilter) {
		case "all":
			return <AllComponent />;
		case "song":
			return <SongsSearchComponent />;
		case "artist":
			return <ArtistSearchComponent />;
		case "genre":
			return <GenreSearchComponent />;
		default:
			return <Text>Something very bad happened: {currentFilter}</Text>;
	}
};

export const SearchResultComponent = (props: any) => {
	const [searchString, setSearchString] = useState<string>("");
	const {stringQuery, updateStringQuery} = React.useContext(SearchContext);
	const [shouldOutput, setShouldOutput] = useState<boolean>(true);

	useEffect(() => {
		if (stringQuery.trim().length > 0) {
			setShouldOutput(true);
		} else if (stringQuery === "") {
			setShouldOutput(false);
		}
	}, [stringQuery]);

	return shouldOutput ? (
		<Box p={5}>
			<FilterSwitch/>
		</Box>
	) : (
		<HomeSearchComponent/>
	);
};