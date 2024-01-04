import { View } from 'react-native';
import { Text } from 'native-base';
import { useQuery } from '../../Queries';
import API from '../../API';
import { translate } from '../../i18n/i18n';
import { LoadingView } from '../Loading';

type historyRowProps = {
	type: string;
	query: string;
	timestamp: Date;
};

const HistoryRowComponent = (props: historyRowProps) => {
	return (
		<View
			style={{
				borderTopWidth: 1,
				borderTopColor: '#9E9E9E',
				paddingTop: 5,
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				gap: 10,
			}}
		>
			<View>
				<View
					style={{
						backgroundColor: 'gray',
						borderRadius: 8,
						paddingVertical: 4,
						paddingHorizontal: 12,
						alignSelf: 'flex-start',
					}}
				>
					<Text>{props.type}</Text>
				</View>
				<Text>{props.query}</Text>
			</View>
			<Text>{props.timestamp.toLocaleDateString()}</Text>
		</View>
	);
};

const SearchHistoryComponent = () => {
	const historyQuery = useQuery(API.getSearchHistory(0, 12));

	if (historyQuery.isLoading) {
		return <LoadingView />;
	}

	return (
		<View style={{ display: 'flex', gap: 10 }}>
			<Text fontSize={20}>{translate('histoHeading')}</Text>
			<Text>{translate('histoDesc')}</Text>
			{historyQuery.data?.map((data, index) => (
				<HistoryRowComponent
					key={index}
					type={data.type}
					query={data.query}
					timestamp={data.timestamp}
				/>
			))}
		</View>
	);
};

export default SearchHistoryComponent;
