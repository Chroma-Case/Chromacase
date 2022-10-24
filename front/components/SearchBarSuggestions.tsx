import React from "react";
import SearchBar from "../components/SearchBar";

interface SearchBarSuggestionsProps {
	onTextSubmit: (text: string) => void;
	suggestions: string[];
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
				searchText === ""
					? []
					: suggestions.filter((suggestion) =>
							suggestion.toLowerCase().includes(searchText.toLowerCase())
					  )
			}
		/>
	);
};

export default SearchBarSuggestions;
