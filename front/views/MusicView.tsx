import React from 'react';
import { useBreakpointValue, useTheme } from 'native-base';
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
import { useNavigation } from '../Navigation';
import { Translate, TranslationKey } from '../i18n/i18n';
import MusicList from '../components/UI/MusicList';
import { useQuery } from '../Queries';
import API from '../API';
import { LoadingView } from '../components/Loading';
import { useLikeSongMutation } from '../utils/likeSongMutation';
import Song from '../models/Song';

type MusicListCCProps = {
	data: Song[] | undefined;
	isLoading: boolean;
	refetch: () => void;
};

const MusicListCC = ({ data, isLoading, refetch }: MusicListCCProps) => {
	const navigation = useNavigation();
	const { mutateAsync } = useLikeSongMutation();
	const user = useQuery(API.getUserInfo);

	const musics = (data ?? []).map((song) => {
		const isLiked = song.likedByUsers?.some(({ userId }) => userId === user.data?.id) ?? false;

		return {
			artist: song.artist!.name,
			song: song.name,
			image: song.cover,
			lastScore: song.lastScore,
			bestScore: song.bestScore,
			liked: isLiked,
			onLike: (state: boolean) => {
				mutateAsync({ songId: song.id, like: state }).then(() => refetch());
			},
			onPlay: () => navigation.navigate('Play', { songId: song.id }),
		};
	});

	if (isLoading) {
		return <LoadingView />;
	}

	return <MusicList initialMusics={musics} musicsPerPage={25} />;
};

const FavoritesMusic = () => {
	const likedSongs = useQuery(API.getLikedSongs(['artist', 'SongHistory', 'likedByUsers']));
	return (
		<MusicListCC
			data={likedSongs.data?.map((x) => x.song)}
			isLoading={likedSongs.isLoading}
			refetch={likedSongs.refetch}
		/>
	);
};

const RecentlyPlayedMusic = () => {
	const playHistory = useQuery(API.getUserPlayHistory(['artist', 'SongHistory', 'likedByUsers']));
	return (
		<MusicListCC
			data={
				playHistory.data?.filter((x) => x.song !== undefined).map((x) => x.song) as Song[]
			}
			isLoading={playHistory.isLoading}
			refetch={playHistory.refetch}
		/>
	);
};

const StepUpMusic = () => {
	const nextStep = useQuery(API.getSongSuggestions(['artist', 'SongHistory', 'likedByUsers']));
	return (
		<MusicListCC
			data={nextStep.data ?? []}
			isLoading={nextStep.isLoading}
			refetch={nextStep.refetch}
		/>
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

const MusicTab = () => {
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
	);
};

export default MusicTab;
