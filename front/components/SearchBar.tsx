import {
	Icon,
	Input,
	Button,
	Flex} from "native-base";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { translate } from "../i18n/i18n";
import { SearchContext } from "../views/SearchView";
import { debounce } from 'lodash';

type Filter = "artist" | "song" | "genre" | "all";

type SearchBarProps = {
	onChangeText?: any;
};

type FilterButton = {
	name: string;
	callback: () => void;
	id: Filter;
};

const SearchBar = (props: SearchBarProps) => {
	const {filter, updateFilter} = React.useContext(SearchContext);
	const {stringQuery, updateStringQuery} = React.useContext(SearchContext);

	const debouncedUpdateStringQuery = debounce(updateStringQuery, 400);

	const filters: FilterButton[] = [
		{
			name: translate('allFilter'),
			callback: () => updateFilter('all'),
			id: 'all'
		},
		{
			name: translate('artistFilter'),
			callback: () => updateFilter('artist'),
			id: 'artist',
		},
		{
			name: translate('songsFilter'),
			callback: () => updateFilter('song'),
			id: 'song',
		},
		{
			name: translate('genreFilter'),
			callback: () => updateFilter('genre'),
			id: 'genre',
		},
	];

	return (
		<Flex m={3} flexDirection={["column", "row"]}>
			<Input
				onChangeText={(text) => debouncedUpdateStringQuery(text)}
				variant={"rounded"}
				rounded={"full"}
				placeholder={translate('search')}
				width={['100%', '50%']} //responsive array syntax with native-base
				py={2}
				px={2}
				fontSize={'12'}
				InputLeftElement={
				<Icon
					m={[1, 2]}
					ml={[2, 3]}
					size={['4', '6']}
					color="gray.400"
					as={<MaterialIcons name="search" />}
				/>
				}
			/>
			<Flex flexDirection={'row'} >
				{filters.map((btn) => (
					<Button
						key={btn.name}
						rounded={'full'}
						onPress={btn.callback}
						mx={[2, 5]}
						my={[1, 0]}
						minW={[30, 20]}
						variant={filter === btn.id ? 'solid' : 'outline'}>
						{btn.name}
					</Button>
				))}
			</Flex>
		</Flex>
	);
}

export default SearchBar