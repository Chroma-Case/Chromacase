import React, { useMemo } from 'react';
import ScaffoldCC from '../../components/UI/ScaffoldCC';
import SearchBarComponent from '../../components/V2/SearchBar';
import { RouteProps, useNavigation } from '../../Navigation';
import { useQuery } from '../../Queries';
import API from '../../API';
import { View, StyleSheet } from 'react-native';
import SearchHistory from '../../components/V2/SearchHistory';
import MusicItem from '../../components/UI/MusicItem';
import { FlatList, HStack, useBreakpointValue, useTheme, Text, Row } from 'native-base';
import { translate } from '../../i18n/i18n';
import { ArrowDown2, ArrowRotateLeft, Cup, Icon } from 'iconsax-react-native';

export type searchProps = {
	artist: number | undefined;
	genre: number | undefined;
	query: string;
};

const Oui = ({yes}: {yes: any[]}) => {
	const { colors } = useTheme();
	const screenSize = useBreakpointValue({ base: 'small', md: 'md', xl: 'xl' });
	const isBigScreen = screenSize === 'xl';

	const headerComponent = useMemo(
		() => (
			<HStack
				space={isBigScreen ? 1 : 2}
				style={{
					backgroundColor: colors.coolGray[500],
					paddingHorizontal: isBigScreen ? 8 : 16,
					paddingVertical: 12,
					marginBottom: 2,
				}}
			>
				<Text
					fontSize="lg"
					style={{
						flex: 4,
						width: '100%',
						justifyContent: 'center',
						paddingRight: 60,
					}}
				>
					{translate('musicListTitleSong')}
				</Text>
				{[
					{ text: translate('musicListTitleLastScore'), icon: ArrowRotateLeft },
					{ text: translate('musicListTitleBestScore'), icon: Cup },
				].map((value) => (
					<Row
			style={{
				display: 'flex',
				flex: 1,
				maxWidth: isBigScreen ? 150 : 50,
				height: '100%',
				alignItems: 'center',
				justifyContent: isBigScreen ? 'flex-end' : 'center',
			}}
		>
			{/* Conditional rendering based on screen size. */}
			{isBigScreen && (
				<Text fontSize="lg" style={{ paddingRight: 8 }}>
					{value.text}
				</Text>
			)}
			{/* Icon with color based on the current color scheme. */}
			<value.icon size={18} color={colors.text[700]} />
		</Row>
				))}
			</HStack>
		),
		[colors.coolGray[500], isBigScreen]
	);

	return (
		// <View>
		// 	{yes.map((song) => (
		// 		<MusicItem
		// 		artist={song?.artist}
		// 		song={song?.song}
		// 		image={song?.cover}
		// 		lastScore={42}
		// 		bestScore={42}
		// 		liked={true}
		// 		onLike={() => {
		// 			console.log('onLike');
		// 		}}
		// 		onPlay={() => navigation.navigate('Play', { songId: song.id })}
		// 		/>
		// 	))}
		// </View>
		<FlatList
			nestedScrollEnabled
			style={styles.container}
			ListHeaderComponent={headerComponent}
			data={yes}
			renderItem={({ item }) => <MusicItem style={{ marginBottom: 2 }} {...item} />}
			keyExtractor={(item) => item.artist + item.song}
			// ListFooterComponent={
			// 	musicListState.hasMoreMusics ? (
			// 		<View style={styles.footerContainer}>
			// 			{musicListState.loading ? (
			// 				<ActivityIndicator color={colors.primary[300]} />
			// 			) : (
			// 				<ButtonBase
			// 					style={{ borderRadius: 999 }}
			// 					onPress={loadMoreMusicItems}
			// 					icon={ArrowDown2}
			// 				/>
			// 			)}
			// 		</View>
			// 	) : null
			// }
		/>
	);
}

// eslint-disable-next-line @typescript-eslint/ban-types
const SearchView = (props: RouteProps<{}>) => {
	const navigation = useNavigation();
	const [searchQuery, setSearchQuery] = React.useState({} as searchProps);
	const rawResult = useQuery(API.getAllSongs(searchQuery.query));
	const result =
	rawResult.data?.map((song) => ({
		artist: song?.artist?.name ?? 'duh',
		song: song?.name,
		image: song?.cover,
		level: 42,
		lastScore: 42,
		bestScore: 42,
		liked: true,
		onLike: () => {
			console.log('onLike');
		},
		onPlay: () => navigation.navigate('Play', { songId: song.id }),
	})) ?? [];

	const handleLog = (query: searchProps) => {
		console.log("got query: ", query.query);
		setSearchQuery(query);
		console.log('raw:' + rawResult);
	}

	const handleClear = () => {
		console.log('stage cleared');
		setSearchQuery({} as searchProps);
	}

	console.table('result:', result);
	console.table('raw:', rawResult);

	return (
		<ScaffoldCC routeName={props.route.name}>
			<View style={{display: 'flex', gap: 20}} >
				<SearchBarComponent onValidate={(data) => handleLog(data)} />
				{result.length != 0
				? <Oui yes={result} />
				: <SearchHistory />}
			</View>
		</ScaffoldCC>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 2,
		borderRadius: 10,
		overflow: 'hidden',
	},
	footerContainer: {
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default SearchView;