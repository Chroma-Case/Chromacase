import {
	HStack,
	Icon,
	Input,
	VStack,
	Button,
	Stack,
	Center,
	Divider,
	Heading,
	Text,
	List,
	Pressable,
	View,
	Box,
	Row,
	useTheme,
	ScrollView,
	Card,
	Image} from "native-base";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { translate } from "../i18n/i18n";
import SongCardGrid from "./SongCardGrid";
// import Card from "./Card";
import { useColorScheme } from "react-native";
import { SettingsState } from '../state/SettingsSlice';
import { RootState } from '../state/Store';
import { useSelector } from "react-redux";


type Filter = "artist" | "song" | "genre" | "all";

type SearchBarProps = {
	getSuggestions?: any;
	onChangeText?: any;
}

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
		<Box mt={3} borderRadius={'md'} maxWidth={props.maxW}>
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
		<HStack>
			<VStack width={'50%'}>
				<Heading>Artists</Heading>
				<ArtistSearchComponent/>
				<Heading>Genres & Moods</Heading>
				<GenreSearchComponent/>
			</VStack>
				<Heading>Songs</Heading>
				<SongsSearchComponent maxW='50%' />
		</HStack>
	);
}

const SearchResultComponent = (props: any) => {
	switch (props.filter) {
		case "all": 
			return (<AllComponent/>);
		case "song":
			return (<SongsSearchComponent/>);
		case "artist":
			return (<ArtistSearchComponent/>);
		case "genre":
			return (<Text>Coming soon genre</Text>);
		default:
			return (<Text>Something very bad happened</Text>);
	}
}

const SearchBar = (props: SearchBarProps) => {
	const [filter, setFilter] = React.useState("all" as Filter);
	const [textSearch, setTextSearch] = React.useState("");

	return (
		<VStack m={5}>
			<HStack >
				<Input onChangeText={(text) => setTextSearch(text)} variant={"rounded"} rounded={"full"} placeholder={translate('searchBtn')} width={'50%'} py="3" px="1" fontSize="14" InputLeftElement={<Icon m="2" ml="3" size="6" color="gray.400" as={<MaterialIcons name="search" />} />} />
				<ScrollView horizontal={true} style={{marginLeft: 5}}>
					<Button rounded={'full'} onPress={() => setFilter('all')} mx={5} minW={20} variant={filter === 'all' ? 'solid' : 'outline'}>
						All
					</Button>
					<Button rounded={'full'} onPress={() => setFilter('artist')} mx={5} minW={20} variant={filter === 'artist' ? 'solid' : 'outline'}>
						Artists
					</Button>
					<Button rounded={'full'} onPress={() => setFilter('song')} mx={5} minW={20} variant={filter === 'song' ? 'solid' : 'outline'}>
						Song
					</Button>
					<Button rounded={'full'} onPress={() => setFilter('genre')} mx={5} minW={20} variant={filter === 'genre' ? 'solid' : 'outline'}>
						Genre
					</Button>
				</ScrollView>
			</HStack>
			{textSearch === '' ? <HomeSearchComponent/> : <SearchResultComponent filter={filter} />}
		</VStack>
	);
}

export default SearchBar