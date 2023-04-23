import {
	Input,
	Column,
	Row,
	Text,
	Pressable,
	HStack,
	VStack,
	Image,
	Icon,
	Square,
} from "native-base";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import useColorScheme from "../hooks/colorScheme";

export enum SuggestionType {
	TEXT,
	ILLUSTRATED,
}

export type SuggestionList = {
	type: SuggestionType;
	data: SuggestionProps | IllustratedSuggestionProps;
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
	const colorScheme = useColorScheme();
	return (
		<Pressable
			onPress={onPress}
			margin={2}
			padding={2}
		>{({ isHovered, isPressed }) => (
			<HStack alignItems="center" space={4}
				bg={colorScheme == 'dark'
					? (isHovered || isPressed) ? 'gray.800' : undefined
					: (isHovered || isPressed) ? 'primary.100' : undefined
				}
			>
				<Square size={"sm"}>
					<Image
						source={{ uri: imageSrc }}
						alt="Alternate Text"
						size="xs"
						rounded="lg"
					/>
				</Square>
				<VStack alignItems="flex-start">
					<Text fontSize="md">{text}</Text>
					<Text fontSize="sm" color="gray.500">
						{subtext}
					</Text>
				</VStack>
			</HStack>
		)}</Pressable>
	);
};

const TextSuggestion = ({ text, onPress }: SuggestionProps) => {
	const colorScheme = useColorScheme();
	return (
		<Pressable
			onPress={onPress}
			margin={2}
			padding={2}
		>{({ isHovered, isPressed }) => (
			<Row alignItems="center" space={4}
				bg={colorScheme == 'dark'
					? (isHovered || isPressed) ? 'gray.800' : undefined
					: (isHovered || isPressed) ? 'primary.100' : undefined
				}
			>
				<Square size={"sm"}>
					<Icon size={"md"} as={Ionicons} name="search" />
				</Square>
				<Text fontSize="md">{text}</Text>
			</Row>
		)}</Pressable>
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

const SearchBar_old = ({
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
			<Column>{SuggestionRenderer(suggestions)}</Column>
		</>
	);
};

export default SearchBar_old;