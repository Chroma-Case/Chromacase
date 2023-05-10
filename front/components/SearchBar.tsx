import {
	HStack,
	Icon,
	Input,
	VStack,
	Button,
	ScrollView} from "native-base";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { translate } from "../i18n/i18n";
import { SearchContext } from "../views/SearchView";
import { debounce } from 'lodash';


type Filter = "artist" | "song" | "genre" | "all";

type SearchBarProps = {
	onChangeText?: any;
}

const SearchBar = (props: SearchBarProps) => {
	const {filter, updateFilter} = React.useContext(SearchContext);
	const {stringQuery, updateStringQuery} = React.useContext(SearchContext);

	const debouncedUpdateStringQuery = debounce(updateStringQuery, 400);

	return (
		<VStack m={[3, 5]}>
			<HStack flexDirection={['column', 'row']}>
				<Input
					onChangeText={(text) => debouncedUpdateStringQuery(text)}
					variant={"rounded"}
					rounded={"full"}
					placeholder={translate('searchBtn')}
					width={['100%', '50%']}
					py={[2, 3]}
					px={[2, 1]}
					fontSize={['12', '14']}
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
				<ScrollView
					horizontal={true}
					style={{ marginLeft: [0, 5], marginTop: [2, 0] }}>
					<Button
						rounded={'full'}
						onPress={() => updateFilter('all')}
						mx={[2, 5]}
						my={[1, 0]}
						minW={[30, 20]}
						variant={filter === 'all' ? 'solid' : 'outline'}>
						All
					</Button>
					<Button
						rounded={'full'}
						onPress={() => updateFilter('artist')}
						mx={[2, 5]}
						my={[1, 0]}
						minW={[30, 20]}
						variant={filter === 'artist' ? 'solid' : 'outline'}>
						Artists
					</Button>
					<Button
						rounded={'full'}
						onPress={() => updateFilter('song')}
						mx={[2, 5]}
						my={[1, 0]}
						minW={[30, 20]}
						variant={filter === 'song' ? 'solid' : 'outline'}>
						Song
					</Button>
					<Button
						rounded={'full'}
						onPress={() => updateFilter('genre')}
						mx={[2, 5]}
						my={[1, 0]}
						minW={[30, 20]}
						variant={filter === 'genre' ? 'solid' : 'outline'}>
						Genre
					</Button>
				</ScrollView>
			</HStack>
		</VStack>
	);
}

export default SearchBar