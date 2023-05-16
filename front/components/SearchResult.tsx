import {
	HStack,
	VStack,
	Heading,
	Text,
	Pressable,
	Box,
	ScrollView,
	Card,
	Image,
	Flex} from "native-base";
import React, { useEffect, useState } from "react";
import SongCardGrid from "./SongCardGrid";
import { useColorScheme } from "react-native";
import { SettingsState } from '../state/SettingsSlice';
import { RootState } from '../state/Store';
import { useSelector } from "react-redux";
import { SearchContext } from "../views/SearchView";
import { FlatGrid } from 'react-native-super-grid';
import { CardBorderRadius } from "./Card";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "react-query";
import API from "../API";
import LoadingComponent from "./Loading";
import ArtistCard from "./ArtistCard";
import GenreCard from "./GenreCard";

type CardGridCustomProps<T> = {
	content: T[];
	heading?: JSX.Element;
	maxItemsPerRow?: number;
	style?: Parameters<typeof FlatGrid>[0]['additionalRowStyle'];
	cardComponent: React.ComponentType<T>;
};

const CardGridCustom = <T extends Record<string, any>>(props: CardGridCustomProps<T>) => {
	const { content, heading, maxItemsPerRow, style, cardComponent: CardComponent } = props;

	return (
		<VStack space={5}>
			{heading && <Heading>{heading}</Heading>}
			<FlatGrid
				maxItemsPerRow={maxItemsPerRow}
				additionalRowStyle={style ?? { justifyContent: 'flex-start' }}
				data={content}
				renderItem={({ item }) => <CardComponent {...item} />}
				spacing={10}
			/>
		</VStack>
	);
};

const RowCustom = (props: Parameters<typeof Box>[0]) => {
	const colorScheme: SettingsState['colorScheme'] = useSelector((state: RootState) => state.settings.settings.colorScheme);
	const systemColorMode = useColorScheme();

	return <Pressable>
		{({ isHovered, isPressed }) => (
		<Box {...props} style={{ ...(props.style ?? {}) }}
			py={5}
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

const SongRow = (props: any) => {
	return (
		<RowCustom>
			<HStack px={2} space={5}>
				<Image
					pl={10}
					style={{ zIndex: 0, aspectRatio: 1, borderRadius: 5 }}
					source={{ uri: props.imageUrl ?? 'https://picsum.photos/200' }}
					alt={[props.songTitle, props.artistName].join('-')}
				/>
				<HStack style={{display: 'flex', alignItems: 'center'}} space={6}>
					<Text pl={10} bold fontSize='md'>{props.songTitle}</Text>
					<Text fontSize={"sm"}>{props.artistName}</Text>
				</HStack>
			</HStack>
		</RowCustom>
	);
}

const SongsSearchComponent = (props: any) => {
	const {songData} = React.useContext(SearchContext);

	return (
		<Box>
			<ScrollView>
				{songData?.length ? (
					songData.map((comp, index) => (
						<SongRow
							key={index}
							imageUrl={comp.cover}
							artistName={comp.artistId}
							songTitle={comp.name}
						/>
					))
				) : (
					<Text>No results found</Text>
				)}
			</ScrollView>
		</Box>
	);
}

const HomeSearchComponent = () => {
	const {isLoading: isLoadingHistory, data: historyData, error: historyError} = useQuery(
			'history',
			() => API.getSearchHistory(0, 10),
			{ enabled: true },
		);

	const {isLoading: isLoadingSuggestions, data: suggestionsData, error: suggestionsError} = useQuery(
			'suggestions',
			() => API.getSongSuggestions(),
			{ enabled: true },
		);

	return (
		<VStack mt="5" style={{overflow: 'hidden'}}>
			<Card shadow={3} mb={5}>
				<Heading margin={5}>History</Heading>
				{ isLoadingHistory ? <LoadingComponent/> : <CardGridCustom content={historyData}/> }
			</Card>
			<Card shadow={3} mt={5} mb={5}>
				<Heading margin={5}>Suggestions</Heading>
				{ isLoadingSuggestions ? <LoadingComponent/> : <CardGridCustom content={suggestionsData}/> }
			</Card>
		</VStack>
	);
}

const ArtistSearchComponent = (props: any) => {
	const {artistData} = React.useContext(SearchContext);

	return (
		<Box>
			<CardGridCustom content={artistData} cardComponent={ArtistCard}/>
		</Box>
	);
}

const GenreSearchComponent = (props: any) => {
	const {genreData} = React.useContext(SearchContext);

	return (
		<Box>
			<CardGridCustom content={genreData} cardComponent={GenreCard}/>
		</Box>
	);
}

const AllComponent = () => {
	return (
		<Box>
			<Text fontSize="xl" fontWeight="bold" mt={4}>
				Artists
			</Text>
			<ArtistSearchComponent />
			<Text fontSize="xl" fontWeight="bold" mt={4}>
				Genres & Moods
			</Text>
			<GenreSearchComponent />
			<Text fontSize="xl" fontWeight="bold" mt={4}>
				Songs
			</Text>
			<Flex flexWrap="wrap" direction={['column', 'row']} justifyContent={['flex-start', 'space-between']} mt={4}>
				<SongsSearchComponent w={['100%', '48%']} />
			</Flex>
		</Box>
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
			return <Text>Coming soon genre</Text>;
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
		<FilterSwitch/>
	) : (
		<HomeSearchComponent/>
	);
};