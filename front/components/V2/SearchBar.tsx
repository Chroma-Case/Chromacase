import React from "react";
import { Button, Text, Select} from 'native-base'
import { ScrollView, TextInput, View } from "react-native";
import ButtonBase from "../UI/ButtonBase";
import { AddSquare, SearchNormal1 } from "iconsax-react-native";
import Artist from "../../models/Artist";
import Song from "../../models/Song";
import { useQuery } from "../../Queries";
import API from "../../API";
import {  useNavigation } from "../../Navigation";
import { LoadingView } from "../Loading";
import Genre from "../../models/Genre";


type ArtistChipProps = {
	name: string,
	dbId: number,
	selected?: boolean,
	onPress: () => void;
}

const ArtistChipComponent = (props: ArtistChipProps) => {
	return (
		<View style={{ marginHorizontal: 26 }}>
			<Button onPress={props.onPress}>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						gap: 10,
				}}>
					<AddSquare size="32" color={props.selected ? "#ED4A51" : "#6075F9"}/>
					<Text>{props.name}</Text>
				</View>
			</Button>
		</View>
	)
}

type SearchBarComponentProps = {
	query: string;
};

const SearchBarComponent = (props: SearchBarComponentProps) => {
	const navigation = useNavigation();
	const [isTriggered, setIsTriggered] = React.useState(false);
	const [query, setQuery] = React.useState('');
	const [genre, setGenre] = React.useState({} as Genre | undefined);
	const [artist, setArtist] = React.useState({} as Artist | undefined);
	const [artistSearch, setArtistSearch] = React.useState([] as Artist[]);
	const [songSearch, setSongSearch] = React.useState([] as Song[]);
	const artistsQuery = useQuery(API.getArtists());
	const genresQuery = useQuery(API.getGenres());

	if (artistsQuery.isLoading || genresQuery.isLoading) {
		return <LoadingView />;
	}

	return (
		<View>
			<View style={{
				borderBottomWidth: 1,
				borderBottomColor: '#9E9E9E',
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				margin: 5,
				padding: 16 }}>
				<TextInput value={query}
					placeholder="What are you looking for ?"
					style={{ width: '100%', height: 30}} >
						{artist?.name ? <ArtistChipComponent onPress={() => setArtist(undefined)} name={artist.name} dbId={artist.id} selected={true} /> : null}
				</TextInput>
				<ButtonBase type="menu" icon={SearchNormal1} />
			</View>
			<View style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between" }}>
				<ScrollView horizontal={true} style={{ display: 'flex', flexDirection: "row", paddingVertical: 10}}>
					{artistsQuery.data?.map((artist, index) => (
						<Button onPress={() => setArtist(undefined)}>
							<ArtistChipComponent key={index}
								name={artist.name}
								dbId={artist.id}
								onPress={() => {
									setArtist(artistsQuery.data?.find((data) => {data.id == artist.id}))
								}}
							/>
						</Button>
					))}
				</ScrollView>
				<View>
					<Select selectedValue={genre?.name}
						placeholder="Genre"
						accessibilityLabel="Genre"
						onValueChange={itemValue => {
							setGenre(genresQuery.data?.find((genre) => { genre.name == itemValue }))
							}}
					>
						{genresQuery.data?.map((data, index) => (
							<Select.Item key={index} label={data.name} value={data.name}/>
						))}
					</Select>
				</View>
			</View>
		</View>
	)
}

export default SearchBarComponent;