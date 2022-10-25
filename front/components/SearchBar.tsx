import { useNavigation } from "@react-navigation/native";
import { Input, Column, Text, Box, Button, Pressable, HStack, VStack, Image } from "native-base";
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
	const navigation = useNavigation();
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
							margin={2}
							padding={2}
							bg={"white"}
							_hover={{
								bg: "primary.200",
							}}
							_pressed={{
								bg: "primary.300",
							}}
							onPress={() =>navigation.navigate('Song', { songId: 1 })}
						>
							<HStack>
								<Image
									style={{ zIndex: 0, aspectRatio: 1, margin: 2 }}
									source={{ uri: "https://i.discogs.com/yHqu3pnLgJq-cVpYNVYu6mE-fbzIrmIRxc6vES5Oi48/rs:fit/g:sm/q:90/h:556/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE2NjQ2/ODUwLTE2MDkwNDU5/NzQtNTkxOS5qcGVn.jpeg" }}
								/>
								<VStack>
									<Text>{suggestion.split(' - ')[1]}</Text>
									<Text fontWeight='light'>{suggestion.split(' - ')[0]}</Text>
								</VStack>
							</HStack>
						</Pressable>
					);
				})}
			</Column>
		</>
	);
};

export default SearchBar;
