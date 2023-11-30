import React from 'react';
import { Center, Text, useBreakpointValue, useTheme } from 'native-base';
import { useWindowDimensions } from 'react-native';
import {
	TabView,
	SceneMap,
	TabBar,
	NavigationState,
	Route,
	SceneRendererProps,
} from 'react-native-tab-view';
import { Heart, Clock, StatusUp, FolderCross } from 'iconsax-react-native';
import { Scene } from 'react-native-tab-view/lib/typescript/src/types';
import { RouteProps, useNavigation } from '../Navigation';
import { TranslationKey, translate } from '../i18n/i18n';
import ScaffoldCC from '../components/UI/ScaffoldCC';
import MusicList from '../components/UI/MusicList';
import { useQueries, useQuery } from '../Queries';
import API from '../API';
import Song from '../models/Song';
import { LoadingView } from '../components/Loading';

export const FavoritesMusic = () => {
	const navigation = useNavigation();
	const playHistoryQuery = useQuery(API.getUserPlayHistory);
	const nextStepQuery = useQuery(API.getSongSuggestions);
	const songHistory = useQueries(
		playHistoryQuery.data?.map(({ songID }) => API.getSong(songID)) ?? []
	);
	const artistsQueries = useQueries(
		songHistory
			.map((entry) => entry.data)
			.concat(nextStepQuery.data ?? [])
			.filter((s): s is Song => s !== undefined)
			.map((song) => API.getArtist(song.artistId))
	);

	const isLoading =
		playHistoryQuery.isLoading ||
		nextStepQuery.isLoading ||
		songHistory.some((query) => query.isLoading) ||
		artistsQueries.some((query) => query.isLoading);

	const musics =
		nextStepQuery.data
			?.filter((song: Song) =>
				artistsQueries.find((artistQuery) => artistQuery.data?.id === song.artistId)
			)
			.map((song: Song) => ({
				artist: artistsQueries.find(
					(artistQuery) => artistQuery.data?.id === song.artistId
				)!.data!.name,
				song: song.name,
				image: song.cover,
				level: 42,
				lastScore: 42,
				bestScore: 42,
				liked: false,
				onLike: () => {
					console.log('onLike');
				},
				onPlay: () => navigation.navigate('Play', { songId: song.id }),
			})) ?? [];

	if (isLoading) {
		return <LoadingView />;
	}
	return (
		<>
			{/* <View style={{margin: 30}}>
				<InteractiveCC
					// duration={80}
					styleContainer={{
						borderRadius: 10,
					}}
					style={{
						width: '100%',
						paddingHorizontal: 20,
						paddingVertical: 10,
						// borderRadius: 10,
					}}
					defaultStyle={{
						transform: [{ scale: 1,}],
						shadowOpacity: 0.3,
						shadowRadius: 4.65,
						elevation: 8,
						backgroundColor: colors.primary[300],
					}}
					hoverStyle={{
						transform: [{ scale: 1.02,}],
						shadowOpacity: 0.37,
						shadowRadius: 7.49,
						elevation: 12,
						backgroundColor: colors.primary[400],
					}}
					pressStyle={{
						transform: [{ scale: 0.98,}],
						shadowOpacity: 0.23,
						shadowRadius: 2.62,
						elevation: 4,
						backgroundColor: colors.primary[500],
					}}
					onPress={() => console.log("A que coucou!")}
				>
					<Text selectable={false} style={{color: '#fff'}}>
						Coucou
					</Text>
				</InteractiveCC>
				<ButtonBase
					title="Coucou"
					style={{ marginTop: 20 }}
					type={'filled'}
				/>
			</View> */}
			<MusicList
				initialMusics={musics}
				// musicsPerPage={7}
			/>
		</>
	);
};

export const RecentlyPlayedMusic = () => {
	return (
		<Center style={{ flex: 1 }}>
			<Text>RecentlyPlayedMusic</Text>
		</Center>
	);
};

export const StepUpMusic = () => {
	return (
		<Center style={{ flex: 1 }}>
			<Text>StepUpMusic</Text>
		</Center>
	);
};

const renderScene = SceneMap({
	favorites: FavoritesMusic,
	recentlyPlayed: RecentlyPlayedMusic,
	stepUp: StepUpMusic,
});

const getTabData = (key: string) => {
	switch (key) {
		case 'favorites':
			return { index: 0, icon: Heart };
		case 'recentlyPlayed':
			return { index: 1, icon: Clock };
		case 'stepUp':
			return { index: 2, icon: StatusUp };
		default:
			return { index: 3, icon: FolderCross };
	}
};

const MusicTab = (props: RouteProps<object>) => {
	const layout = useWindowDimensions();
	const [index, setIndex] = React.useState(0);
	const { colors } = useTheme();
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isSmallScreen = screenSize === 'small';
	const routes = [
		{ key: 'favorites', title: 'musicTabFavorites' },
		{ key: 'recentlyPlayed', title: 'musicTabRecentlyPlayed' },
		{ key: 'stepUp', title: 'musicTabStepUp' },
	];
	const renderTabBar = (
		props: SceneRendererProps & { navigationState: NavigationState<Route> }
	) => (
		<TabBar
			{...props}
			style={{
				backgroundColor: 'transparent',
				borderBottomWidth: 1,
				borderColor: colors.primary[300],
			}}
			activeColor={colors.text[900]}
			inactiveColor={colors.text[700]}
			indicatorStyle={{ backgroundColor: colors.primary[300] }}
			renderIcon={(
				scene: Scene<Route> & {
					focused: boolean;
					color: string;
				}
			) => {
				const tabHeader = getTabData(scene.route!.key);
				return (
					<tabHeader.icon
						size="18"
						color="#6075F9"
						variant={scene.focused ? 'Bold' : 'Outline'}
					/>
				);
			}}
			renderLabel={({ route, color }) =>
				layout.width > 800 && (
					<Text style={{ color: color, paddingLeft: 10, overflow: 'hidden' }}>
						{translate(route.title as TranslationKey)}
					</Text>
				)
			}
			tabStyle={{ flexDirection: 'row' }}
		/>
	);

	return (
		<ScaffoldCC routeName={props.route.name} withPadding={false}>
			<TabView
				sceneContainerStyle={{
					flex: 1,
					alignSelf: 'center',
					padding: isSmallScreen ? 8 : 20,
					paddingTop: 32,
					width: '100%',
				}}
				renderTabBar={renderTabBar}
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
			/>
		</ScaffoldCC>
	);
};

export default MusicTab;
