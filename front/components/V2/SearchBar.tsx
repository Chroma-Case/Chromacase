import React from "react";
import { Text, Select } from 'native-base'
import { TextInput, View } from "react-native";
import ButtonBase from "../UI/ButtonBase";
import Artist from "../../models/Artist";
import Song from "../../models/Song";
import { AddSquare } from 'iconsax-react-native';

const artistsDummy = [
	{
		id: 0,
		name: 'Momo'
	},
	{
		id: 1,
		name: 'Beethoven'
	},
	{
		id: 2,
		name: 'Chopin'
	},
	{
		id: 3,
		name: 'Wolfgang'
	},
];

const genreDummy = [
	{
		id: 0,
		name: 'Rock',
	},
	{
		id: 1,
		name: 'Classical',
	},
	{
		id: 2,
		name: 'Pop',
	},
	{
		id: 3,
		name: 'Jazz',
	},
];


const SearchBarComponent = () => {
	const [isTriggered, setIsTriggered] = React.useState(false);
	const [genre, setGenre] = React.useState('')
	const [query, setQuery] = React.useState('')
	const [artistSearch, setArtistSearch] = React.useState([] as Artist[]);
	const [songSearch, setSongSearch] = React.useState([] as Song[]);

	return (
		<View>
			<View style={{ borderBottomWidth: 1, borderBottomColor: '#9E9E9E', display: "flex", flexDirection: "row", margin: 5, padding: 16 }}>
				<TextInput value={query} placeholder="What are you looking for ?" style={{ width: '100%', height: 20}} />
				<ButtonBase type="outlined" />
			</View>
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<View style={{ flexDirection: "row",}}>
					{artistsDummy.map((data) => (
						<View style={{ flexDirection: "row", alignItems: "center", padding: 10, margin: 10}}>
							<AddSquare size="32" color="#6075F9"/>
							<Text ml={2} >{data.name}</Text>
						</View>
					))}
				</View>
				<View>
					<Select selectedValue={genre} placeholder="Genre" accessibilityLabel="Genre" onValueChange={itemValue => setGenre(itemValue)}>
					{genreDummy.map((data) => (
						<Select.Item label={data.name} value={data.name}/>
					))}
					</Select>
				</View>
			</View>
		</View>
	)
}

export default SearchBarComponent;