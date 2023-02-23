import React from "react";
import SearchBar, { IllustratedSuggestionProps } from "../components/SearchBar";
import { SuggestionList, SuggestionType } from "../components/SearchBar";
interface SearchBarSuggestionsProps {
	onTextSubmit: (text: string) => void;
	suggestions: SuggestionList;
}

// do a function that takes in a string and returns a list of filtered suggestions
const filterSuggestions = (text: string, suggestions: SuggestionList) => {
	return suggestions.filter((suggestion) => {
		switch (suggestion.type) {
			case SuggestionType.TEXT:
				return suggestion.data.text.toLowerCase().includes(text.toLowerCase());
			case SuggestionType.ILLUSTRATED:
				return (
					suggestion.data.text.toLowerCase().includes(text.toLowerCase()) ||
					(suggestion.data as IllustratedSuggestionProps).subtext.toLowerCase().includes(text.toLowerCase())
				);
		}
	});
};

const SearchBarSuggestions = ({
	onTextSubmit,
	suggestions,
}: SearchBarSuggestionsProps) => {
	const [searchText, setSearchText] = React.useState("");

	return (
		<SearchBar
			onTextChange={(t) => setSearchText(t)}
			onTextSubmit={onTextSubmit}
			suggestions={
				searchText === "" ? [] : filterSuggestions(searchText, suggestions)
			}
		/>
	);
};

export default SearchBarSuggestions;
