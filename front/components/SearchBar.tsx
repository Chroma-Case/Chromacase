import { Input, Column, Text, Box, Button, Pressable } from "native-base";
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
	const debouncedOnTextChange = React.useRef(
		debounce((t: string) => onTextChange(t), 70)
	).current;
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
						<Pressable
							key={idx}
							padding={2}
							bg={"white"}
							_hover={{
								bg: "primary.200",
							}}
							_pressed={{
								bg: "primary.300",
							}}
							onPress={() => onTextSubmit(suggestion)}
						>
							<Text>{suggestion}</Text>
						</Pressable>
					);
				})}
			</Column>
		</>
	);
};

export default SearchBar;
