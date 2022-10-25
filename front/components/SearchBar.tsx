import { useNavigation } from "@react-navigation/native";
import {
	Input,
	Column,
	Text,
	Box,
	Button,
	Pressable,
	HStack,
	VStack,
	Image,
} from "native-base";
import React from "react";

export enum SuggestionType {
	TEXT,
	ILLUSTRATED,
};

export type SuggestionList = {
	type: SuggestionType,
	data: SuggestionProps | IllustratedSuggestionProps
}[];

export interface SearchBarProps {
	onTextChange: (text: string) => void;
	onTextSubmit: (text: string) => void;
	suggestions: SuggestionList;
}
export interface IllustratedSuggestionProps {
	text: string;
	subtext: string;
	imageSrc: string;
	onPress: () => void;
}

export interface SuggestionProps {
	text: string;
	onPress: () => void;
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

const IllustratedSuggestion = ({
	text,
	subtext,
	imageSrc,
	onPress,
}: IllustratedSuggestionProps) => {
	return (
		<Pressable
			onPress={onPress}
			margin={2}
			padding={2}
			bg={"white"}
			_hover={{
				bg: "primary.200",
			}}
			_pressed={{
				bg: "primary.300",
			}}
		>
			<HStack alignItems="center" space={4}>
				<Image
					source={{ uri: imageSrc }}
					alt="Alternate Text"
					size="sm"
					rounded="lg"
				/>
				<VStack alignItems="flex-start">
					<Text fontSize="md" fontWeight="bold">
						{text}
					</Text>
					<Text fontSize="sm" color="gray.500">
						{subtext}
					</Text>
				</VStack>
			</HStack>
		</Pressable>
	);
};

const TextSuggestion = ({ text, onPress }: SuggestionProps) => {
	return (
		<Pressable
			onPress={onPress}
			margin={2}
			padding={2}
			bg={"white"}
			_hover={{
				bg: "primary.200",
			}}
			_pressed={{
				bg: "primary.300",
			}}
		>
			<Text fontSize="md" fontWeight="bold">
				{text}
			</Text>
		</Pressable>
	);
};

// render the suggestions based on the type
const SuggestionRenderer = (suggestions: SuggestionList) => {
	const suggestionRenderers = {
		[SuggestionType.TEXT]: TextSuggestion,
		[SuggestionType.ILLUSTRATED]: IllustratedSuggestion,
	};
	return suggestions.map((suggestion, index) => {
		const SuggestionComponent = suggestionRenderers[suggestion.type];
		return <SuggestionComponent {...suggestion.data} key={index} />;
	});
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
				{SuggestionRenderer(suggestions)}
			</Column>
		</>
	);
};

export default SearchBar;
/*
<Image
									size={"xs"}
									style={{ zIndex: 0, aspectRatio: 1, margin: 2 }}
									alt="fallback text"
									source={{
										uri: "https://i.discogs.com/yHqu3pnLgJq-cVpYNVYu6mE-fbzIrmIRxc6vES5Oi48/rs:fit/g:sm/q:90/h:556/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE2NjQ2/ODUwLTE2MDkwNDU5/NzQtNTkxOS5qcGVn.jpeg",
									}}
								/>
								*/
