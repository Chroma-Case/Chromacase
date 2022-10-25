import React from "react";
import { useDispatch } from "../state/Store";
import { translate } from "../i18n/i18n";
import { Box, Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import SearchBarSuggestions from "../components/SearchBarSuggestions";
import {
	SuggestionList,
	SuggestionType,
	IllustratedSuggestionProps,
} from "../components/SearchBar";

const onTextSubmit = (text: string) => {
	console.log(text);
};

const SearchView = () => {
	const navigation = useNavigation();

	const IllustratedSuggestion: IllustratedSuggestionProps = {
		text: "Love Story",
		subtext: "Taylor Swift",
		imageSrc:
			"https://i.discogs.com/yHqu3pnLgJq-cVpYNVYu6mE-fbzIrmIRxc6vES5Oi48/rs:fit/g:sm/q:90/h:556/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE2NjQ2/ODUwLTE2MDkwNDU5/NzQtNTkxOS5qcGVn.jpeg",
		onPress: () => navigation.navigate("Song", { songId: 1 }),
	};
	// fill the suggestions with the data from the backend
	const suggestions: SuggestionList = [
		{
			type: SuggestionType.ILLUSTRATED,
			data: IllustratedSuggestion,
		},
		{
			type: SuggestionType.ILLUSTRATED,
			data: IllustratedSuggestion,
		},
		{
			type: SuggestionType.TEXT,
			data: {
				text: "Lady Gaga",
				onPress: () => navigation.navigate("Song", { songId: 1 }),
			},
		},
	];

	return (
		<Box style={{ padding: 10 }}>
			<SearchBarSuggestions
				onTextSubmit={onTextSubmit}
				suggestions={suggestions}
			/>
		</Box>
	);
};

export default SearchView;
