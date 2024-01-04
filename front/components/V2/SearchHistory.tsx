import { View } from 'react-native';
import { Text, theme } from 'native-base';
import { useQuery } from '../../Queries';
import API from '../../API';
import { translate } from '../../i18n/i18n';
import { LoadingView } from '../Loading';
import useColorScheme from '../../hooks/colorScheme';

type historyRowProps = {
	type: string;
	query: string;
	timestamp: Date;
};

const HistoryRowComponent = (props: historyRowProps) => {
	const colorScheme = useColorScheme();

	return (
		<View
			style={{
				borderTopWidth: 1,
				borderColor:
					colorScheme == 'dark' ? theme.colors.coolGray[400] : theme.colors.coolGray[800],
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
						backgroundColor:
							colorScheme == 'dark'
								? theme.colors.coolGray[600]
								: theme.colors.coolGray[400],
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
