import React from "react";
import { useDispatch } from "../state/Store";
import { translate } from "../i18n/i18n";
import { Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import SearchBarSuggestions from "../components/SearchBarSuggestions";

const onTextSubmit = (text: string) => {
	console.log(text);
};

const suggestions = [
	"Taylor Swift",
	"Taylor Swift - Love Story",
	"Lady Gaga",
	"Lady Gaga - Poker Face",
	"Beyonce",
	"Beyonce - Single Ladies",
	"DJ Snake",
	"DJ Snake - Taki Taki",
];

const SearchView = () => {
	const dispatch = useDispatch();
	const navigation = useNavigation();

	return (
		<>
			<Button variant="ghost" onPress={() => navigation.navigate("Home")}>
				{translate("back")}
			</Button>
			<SearchBarSuggestions
				onTextSubmit={onTextSubmit}
				suggestions={suggestions}
			/>
		</>
	);
};

export default SearchView;
