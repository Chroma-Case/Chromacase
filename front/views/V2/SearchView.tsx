import React from 'react';
import ScaffoldCC from '../../components/UI/ScaffoldCC';
import SearchBarComponent from '../../components/V2/SearchBar';
import { RouteProps } from '../../Navigation';
import SearchHistory from '../../components/V2/SearchHistory';
import { View } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
const SearchView = (props: RouteProps<{}>) => {
	return (
		<ScaffoldCC routeName={props.route.name}>
			<View style={{ display: 'flex', gap: 50 }}>
				<SearchBarComponent />
				<SearchHistory />
			</View>
		</ScaffoldCC>
	);
};

export default SearchView;
