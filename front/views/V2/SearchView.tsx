import React from 'react';
import ScaffoldCC from '../../components/UI/ScaffoldCC';
import SearchBarComponent from '../../components/V2/SearchBar';
import { RouteProps } from '../../Navigation';

// eslint-disable-next-line @typescript-eslint/ban-types
const SearchView = (props: RouteProps<{}>) => {
	return (
		<ScaffoldCC routeName={props.route.name}>
			<SearchBarComponent />
		</ScaffoldCC>
	);
};

export default SearchView;
