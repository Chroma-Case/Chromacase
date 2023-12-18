import React from 'react';
<<<<<<< HEAD
import { Center, useBreakpointValue, useTheme } from 'native-base';
=======
import { Center, Text, Toast, useBreakpointValue, useTheme } from 'native-base';
>>>>>>> 06cfa56 (Front: Use Mutations to update 'liked' state)
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
import { Translate, TranslationKey } from '../i18n/i18n';
import ScaffoldCC from '../components/UI/ScaffoldCC';
import MusicList from '../components/UI/MusicList';
import { useQuery } from '../Queries';
import API from '../API';
import { LoadingView } from '../components/Loading';
import { useLikeSongMutation } from '../utils/likeSongMutation';

export const FavoritesMusic = () => {
	const navigation = useNavigation();
	const likedSongs = useQuery(API.getLikedSongs(['artist', 'SongHistory']));
	const { mutate } = useLikeSongMutation();

	const musics =
		likedSongs.data?.map((x) => ({
			artist: x.song.artist!.name,
			song: x.song.name,
			image: x.song.cover,
			lastScore: x.song.lastScore,
			bestScore: x.song.bestScore,
			liked: true,
			onLike: () => {
				Toast.show({ description: 'aaaaaaa' })
				mutate({ songId: x.id, like: false })
			},
			onPlay: () => navigation.navigate('Play', { songId: x.song.id }),
		})) ?? [];

	if (likedSongs.isLoading) {
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
			<Translate translationKey="recentlyPlayed" />
		</Center>
	);
};

export const StepUpMusic = () => {
	return (
		<Center style={{ flex: 1 }}>
			<Translate translationKey="musicTabStepUp" />
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
					<Translate
						translationKey={route.title as TranslationKey}
						style={{ color: color, paddingLeft: 10, overflow: 'hidden' }}
					/>
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
