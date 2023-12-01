import React from 'react';
import { View } from 'react-native';
import SearchBarComponent from '../../components/V2/SearchBar';

// search with all parameters from search bar function

// return to search bar auto completion thing

const SearchView = () => {
	return (
		<View style={{ display: 'flex', flexDirection: 'column', padding: 3 }}>
			<SearchBarComponent />
		</View>
	);
};

export default SearchView;
