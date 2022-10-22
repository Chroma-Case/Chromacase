import { Input, Column, Text, Box } from "native-base";
import React from "react";

interface SearchBarProps {
	onTextChange: (text: string) => void;
	onTextSubmit: (text: string) => void;
	suggestions: string[];
}

// debounce function
const debounce = (func: any, delay: number) => {
    let inDebounce: any;
    return function (this: any) {
        const context = this;
        const args = arguments;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
};

const SearchBar = ({
	onTextChange,
	onTextSubmit,
	suggestions,
}: SearchBarProps) => {
    const debouncedOnTextChange = React.useRef(debounce((t: string) => onTextChange(t), 500)).current;
	return (
		<>
			<Input
				placeholder="Search"
				type="text"
				onChangeText={debouncedOnTextChange}
				onSubmitEditing={(event) => onTextSubmit(event.nativeEvent.text)}
			/>
			<Column>
				{suggestions.map((suggestion, idx) => {
					return (
						<Box key={idx} padding={2} bg={"gray.100"}>
							<Text>{suggestion}</Text>
						</Box>
					);
				})}
			</Column>
		</>
	);
};

export default SearchBar;
