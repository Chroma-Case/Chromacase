import React from "react";
import { useDispatch } from "../state/Store";
import { translate } from "../i18n/i18n";
import { Box, Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import SearchBarSuggestions from "../components/SearchBarSuggestions";

const onTextSubmit = (text: string) => {
	console.log(text);
};

const suggestions = [
	"Taylor Swift - Love Story",
	"Lady Gaga - Poker Face",
	"Beyonce - Single Ladies",
	"DJ Snake - Taki Taki",
];

const SearchView = () => {
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
