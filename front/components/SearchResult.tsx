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
    Flex,
    Container,
    View} from "native-base";
import React, { useEffect, useState } from "react";
import SongCardGrid from "./SongCardGrid";
import { useColorScheme } from "react-native";
import { SettingsState } from '../state/SettingsSlice';
import { RootState } from '../state/Store';
import { useSelector } from "react-redux";
import { SearchContext } from "../views/SearchView";

const songSuggestions = [
	{
		albumCover: "https://wallpaperaccess.com/full/317501.jpg",
		songTitle: "Sous Le Vent",
		artistName: "Céline Dion",
		songId: 0
	},
	{
		albumCover: "https://wallpaperaccess.com/full/317501.jpg",
		songTitle: "Alo Aleky",
		artistName: "Mohammed Saeed",
		songId: 1
	},
	{
		albumCover: "https://wallpaperaccess.com/full/317501.jpg",
		songTitle: "Deux Arabesques",
		artistName: "Clause Debussy",
		songId: 2
	},
	{
		albumCover: "https://wallpaperaccess.com/full/1107685.jpg",
		songTitle: "Do I Wanna Know",
		artistName: "Arctic Monkeys",
		songId: 3
	},
	{
		albumCover: "https://wallpaperaccess.com/full/1702441.jpg",
		songTitle: "Rocket Man",
		artistName: "Elton John",
		songId: 4
	},
	{
		albumCover: "https://wallpaperaccess.com/full/1695791.jpg",
		songTitle: "Whatever It Takes",
		artistName: "Imagin Dragons",
		songId: 4
	},
	{
		albumCover: "https://wallpaperaccess.com/full/317501.jpg",
		songTitle: "Bad Day",
		artistName: "Daniel Powter",
		songId: 3
	},
	{
		albumCover: "https://wallpaperaccess.com/full/317501.jpg",
		songTitle: "Lambé An Dro",
		artistName: "Matmatah",
		songId: 4
	},
	{
		albumCover: "https://wallpaperaccess.com/full/317501.jpg",
		songTitle: "Too Precious",
		artistName: "The Stranglers",
		songId: 0
	},
	{
		albumCover: "https://wallpaperaccess.com/full/317501.jpg",
		songTitle: "I'm A Believer",
		artistName: "Smash Mouth",
		songId: 1
	},
	{
		albumCover: "https://wallpaperaccess.com/full/317501.jpg",
		songTitle: "Waltz no2 4th Mvmt",
		artistName: "Dimitri Shostakovich",
		songId: 2
	},
	{
		albumCover: "https://wallpaperaccess.com/full/2424293.jpg",
		songTitle: "Battle Theme",
		artistName: "Nobuo Uematsu",
		songId: 3
	},
	{
		albumCover: "https://wallpaperaccess.com/full/325001.jpg",
		songTitle: "Kingdom Hearts",
		artistName: "Yoko Shimomura",
		songId: 4
	},
	{
		albumCover: "https://wallpaperaccess.com/full/961364.jpg",
		songTitle: "Sanctuary",
		artistName: "Utada",
		songId: 3
	},
]

const searchHistory = [
	{
		albumCover: "https://wallpaperaccess.com/full/1885275.jpg",
		songTitle: "Sidi Mansour",
		artistName: "Saber Rebai",
		songId: 4
	},
	{
		albumCover: "https://wallpaperaccess.com/full/1487834.jpg",
		songTitle: "Chariots Of Fire",
		artistName: "Vangelis",
		songId: 4
	},
	{
		albumCover: "https://wallpaperaccess.com/full/1427348.jpg",
		songTitle: "Californicatio",
		artistName: "Red Hot Chili Peppers",
		songId: 4
	},
	{
		albumCover: "https://wallpaperaccess.com/full/2324317.jpg",
		songTitle: "Stay\'in Alive",
		artistName: "Bee Gees",
		songId: 4
	},
	{
		albumCover: "https://wallpaperaccess.com/full/8949375.jpg",
		songTitle: "Peaches",
		artistName: "Jack Black",
		songId: 4
	},
	{
		albumCover: "https://wallpaperaccess.com/full/317501.jpg",
		songTitle: "Down Under",
		artistName: "Men At Work",
		songId: 4
	},
	{
		albumCover: "https://wallpaperaccess.com/full/317501.jpg",
		songTitle: "Legend",
		artistName: "Tevvez",
		songId: 4
	},
	{
		albumCover: "https://wallpaperaccess.com/full/8949375.jpg",
		songTitle: "Peaches",
		artistName: "Jack Black",
		songId: 4
	},
	{
		albumCover: "https://wallpaperaccess.com/full/1487834.jpg",
		songTitle: "Chariots Of Fire",
		artistName: "Vangelis",
		songId: 4
	},
	{
		albumCover: "https://wallpaperaccess.com/full/1487834.jpg",
		songTitle: "Chariots Of Fire",
		artistName: "Vangelis",
		songId: 4
	},
]

const HomeSearchComponent = () => {
	return (
		<VStack mt="5" style={{overflow: 'hidden'}}>
			<Card shadow={3} mb={5}>
				<Heading margin={5}>History</Heading>
				<SongCardGrid songs={searchHistory}/>
			</Card>
			<Card shadow={3} mt={5} mb={5}>
				<Heading margin={5}>Suggestions</Heading>
				<SongCardGrid songs={songSuggestions}/>
			</Card>
		</VStack>
	);
}

const RowCustom = (props: Parameters<typeof Box>[0] & { onPress: () => void }) => {
	const colorScheme: SettingsState['colorScheme'] = useSelector((state: RootState) => state.settings.settings.colorScheme);
	const systemColorMode = useColorScheme();

	return <Pressable onPress={props.onPress}>
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
					style={{ zIndex: 0, aspectRatio: 1, borderRadius: 5}}
					source={{ uri: props.imageUrl }}
					alt={[props.songTitle, props.artistName].join('-')} />
				<HStack style={{display: 'flex', alignItems: 'center'}} space={6}>
					<Text pl={10} bold fontSize='md'>{props.songTitle}</Text>
					<Text fontSize={"sm"}>{props.artistName}</Text>
				</HStack>
			</HStack>
		</RowCustom>
	)
}

const SongsSearchComponent = (props: any) => {
	return (
		<Box>
			<ScrollView>
				{songSuggestions.map((comp, index) => (
					<SongRow
					key={index}
					imageUrl={comp.albumCover}
					artistName={comp.artistName}
					songTitle={comp.songTitle}
					/>
					))}
			</ScrollView>
		</Box>
	);
}

const ArtistSearchComponent = (props: any) => {
	return (
		<Box>
			<SongCardGrid songs={searchHistory}/>
		</Box>
	);
}

const GenreSearchComponent = (props: any) => {
	return (
		<Box>
			<SongCardGrid songs={searchHistory}/>
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
    
    // Render your component using the shouldOutput state
    return shouldOutput ? (
        <FilterSwitch/>
    ) : (
        <HomeSearchComponent/>
    );
    
};