import React, { useMemo } from 'react';
import { FlatList, HStack, useBreakpointValue, useTheme, Text, Row } from 'native-base';
import { RouteProps, useNavigation } from '../../Navigation';
import { ArrowRotateLeft, Cup } from 'iconsax-react-native';
import { View, StyleSheet } from 'react-native';
import { useQuery } from '../../Queries';
import { translate } from '../../i18n/i18n';
import SearchBarComponent from '../../components/V2/SearchBar';
import SearchHistory from '../../components/V2/SearchHistory';
import ScaffoldCC from '../../components/UI/ScaffoldCC';
import MusicItem from '../../components/UI/MusicItem';
import API from '../../API';
import { useMutation, useQueryClient } from 'react-query';
import LoadingComponent from '../../components/Loading';
import ErrorView from '../ErrorView';

export type searchProps = {
	artist: number | undefined;
	genre: number | undefined;
	query: string;
};

const MusicListNoOpti = ({ list }: { list: any[] }) => {
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
						key={value.text}
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
		<FlatList
			nestedScrollEnabled
			style={styles.container}
			ListHeaderComponent={headerComponent}
			data={list}
			renderItem={({ item }) => <MusicItem style={{ marginBottom: 2 }} {...item} />}
			keyExtractor={(item) => item.artist + item.song}
		/>
	);
};

// eslint-disable-next-line @typescript-eslint/ban-types
const SearchView = (props: RouteProps<{}>) => {
	const navigation = useNavigation();
	const artists = useQuery(API.getAllArtists());
	const [searchQuery, setSearchQuery] = React.useState({} as searchProps);
	const rawResult = useQuery(API.searchSongs(searchQuery));
	const queryClient = useQueryClient();
	const userQuery = useQuery(API.getUserInfo());
	let result: any[];
	
	const { mutate } = useMutation(
		(songId: number) => API.addLikedSong(songId),
		{
			onSuccess: () => {
			queryClient.setQueryData(['search'], (prevData: any[] | undefined) => {
				if (prevData) {
				return prevData.map((song) => {
					if (song.id === songId) {
					return {
						...song,
						liked: !song.liked,
					};
					}
					return song;
				});
				}
				return prevData;
			});
			},
		}
	);

	if (userQuery.isLoading) {
		return <LoadingComponent/>
	}

	if (userQuery.isError) {
		return <ErrorView/>
	}

	if (userQuery.isSuccess) {
		result = rawResult.data?.map((song) => ({
			artist:
				artists.data?.find((artist) => artist.id === song?.artist?.id)?.name ??
				'unknown artist',
			song: song?.name,
			image: song?.cover,
			level: song?.difficulties.chordcomplexity,
			lastScore: song?.lastScore,
			bestScore: song?.bestScore,
			liked: song?.likedByUsers?.includes(userQuery.data.id) ? true : false,
			onLike: () => {
				mutate(song.id);
			},
			onPlay: () => navigation.navigate('Play', { songId: song.id }),
		})) ?? [];
	}

	return (
		<ScaffoldCC routeName={props.route.name}>
			<View style={{ display: 'flex', gap: 20 }}>
				<SearchBarComponent onValidate={(query) => setSearchQuery(query)} />
				{result.length != 0 ? <MusicListNoOpti list={result} /> : <SearchHistory />}
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
});

export default SearchView;
