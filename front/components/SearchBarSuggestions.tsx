import React from "react";
import SearchBar from "../components/SearchBar";
import { SuggestionList } from "../components/SearchBar"
interface SearchBarSuggestionsProps {
	onTextSubmit: (text: string) => void;
	suggestions: SuggestionList;
}

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
				suggestions
			}
		/>
	);
};

/*

searchText === ""
					? []
					: suggestions.filter((suggestion) =>
							suggestion.toLowerCase().includes(searchText.toLowerCase())
					  )
					  */

export default SearchBarSuggestions;
