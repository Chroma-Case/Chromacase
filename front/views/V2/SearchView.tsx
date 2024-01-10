import SearchBarComponent from '../../components/V2/SearchBar';
import SearchHistory from '../../components/V2/SearchHistory';
import { View } from 'react-native';

const SearchView = () => {
	return (
		<View style={{ display: 'flex', gap: 50 }}>
			<SearchBarComponent />
			<SearchHistory />
		</View>
	);
};

export default SearchView;
