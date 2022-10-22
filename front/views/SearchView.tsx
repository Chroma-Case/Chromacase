import React from "react";
import { useDispatch } from "../state/Store";
import { translate } from "../i18n/i18n";
import { Center, Button, Text } from "native-base";
import SearchBar from "../components/SearchBar";
import { useNavigation } from "@react-navigation/native";

const onChangeText = (text: string) => {
	console.log("change", text);
};

const onTextSubmit = (text: string) => {
	console.log(text);
};

const suggestions = ["a", "bfzefzef", "cfe"];

const SearchView = () => {
	const dispatch = useDispatch();
	const navigation = useNavigation();

	return (
		<>
			<Button variant="ghost" onPress={() => navigation.navigate("Home")}>
				{translate("back")}
			</Button>
			<SearchBar
				onTextChange={onChangeText}
				onTextSubmit={onTextSubmit}
				suggestions={suggestions}
			/>
		</>
	);
};

export default SearchView;
