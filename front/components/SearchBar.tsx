import { Icon, Input, Button, Flex } from 'native-base';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { translate } from '../i18n/i18n';
import { SearchContext } from '../views/SearchView';
import { debounce } from 'lodash';

export type Filter = 'artist' | 'song' | 'genre' | 'all' | 'favorites';

type FilterButton = {
	name: string;
	callback: () => void;
	id: Filter;
};

const SearchBar = () => {
	const { filter, updateFilter } = React.useContext(SearchContext);
	const { stringQuery, updateStringQuery } = React.useContext(SearchContext);
	const [barText, updateBarText] = React.useState(stringQuery);

	const debouncedUpdateStringQuery = debounce(updateStringQuery, 500);

	// there's a bug due to recursive feedback that erase the text as soon as you type this is a temporary "fix"
	// will probably be fixed by removing the React.useContext
	// React.useEffect(() => {
	// 	updateBarText(stringQuery);
	// }, [stringQuery]);

	const handleClearQuery = () => {
		updateStringQuery('');
		updateBarText('');
	};

	const handleChangeText = (text: string) => {
		debouncedUpdateStringQuery(text);
		updateBarText(text);
	};

	const filters: FilterButton[] = [
		{
			name: translate('allFilter'),
			callback: () => updateFilter('all'),
			id: 'all',
		},
		{
			name: translate('favoriteFilter'),
			callback: () => updateFilter('favorites'),
			id: 'favorites',
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
		<Flex m={3} flexDirection={['column', 'row']}>
			<Input
				onChangeText={(text) => handleChangeText(text)}
				variant={'rounded'}
				value={barText}
				rounded={'full'}
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
				InputRightElement={
					<Icon
						m={[1, 2]}
						mr={[2, 3]}
						size={['4', '6']}
						color="gray.400"
						onPress={handleClearQuery}
						as={<MaterialIcons name="close" />}
					/>
				}
			/>

			<Flex flexDirection={'row'}>
				{filters.map((btn) => (
					<Button
						key={btn.name}
						rounded={'full'}
						onPress={btn.callback}
						mx={[2, 5]}
						my={[1, 0]}
						minW={[30, 20]}
						variant={filter === btn.id ? 'solid' : 'outline'}
					>
						{btn.name}
					</Button>
				))}
			</Flex>
		</Flex>
	);
};

export default SearchBar;
