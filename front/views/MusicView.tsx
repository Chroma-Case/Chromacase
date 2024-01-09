import React from 'react';
import { View, useBreakpointValue, useTheme, Text } from 'native-base';
import { StyleProp, ViewStyle, useWindowDimensions } from 'react-native';
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
import Song from '../models/Song';
import InteractiveCC from '../components/UI/InteractiveCC';
import ButtonBase from '../components/UI/ButtonBase';
import InteractiveBase from '../components/UI/InteractiveBaseV2';
import AnimatedBase from '../components/UI/AnimatedBase';
import useInteractionState from '../components/UI/useInteractionState';

// import React from 'react';
// import { Text, View } from 'react-native';
// import InteractiveBase from './InteractiveBase';
// import AnimatedBase from './AnimatedBase';
// import useInteractionState from './useInteractionState';

interface LinkBaseProps {
	text: string;
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<ViewStyle>;
	underlineStyle?: StyleProp<ViewStyle>;
	fontSize?: number;
	onPress: () => void;
}

const AnimatedLink = ({ text, style, textStyle, underlineStyle, fontSize = 14 }: LinkBaseProps) => {
  const interaction = useInteractionState({
	onPressOut: () => { console.log("AnimatedLink is activate")}
  });
  const { colors } = useTheme();

  const defaultUnderlineStyle = { height: fontSize / 8, bottom: 0 };
  const hoverUnderlineStyle = { height: fontSize * 1.5, bottom: 0 };
  const pressUnderlineStyle = { height: 0, bottom: fontSize * 1.5 };

  return (
	<View style={{ flex: 1, alignItems: 'flex-start', position: 'relative'}}>
		<InteractiveBase {...interaction} style={style}>
			<AnimatedBase
				defaultStyle={{ fontSize: 14 }}
				hoverStyle={{ fontSize: 16 }}
				pressStyle={{ fontSize: 8 }}
				currentState={interaction.state}
			>
				<Text selectable={false} style={[textStyle]}>
				{/* {fontSize: fontSize},  */}
					{text}
				</Text>
			</AnimatedBase>
			<AnimatedBase
				style={[{
					minWidth: '100%',
					position: 'absolute',
					zIndex: -1,
					backgroundColor: colors.primary[600],
				}, underlineStyle && {underlineStyle}]}
				defaultStyle={{ ...defaultUnderlineStyle }}
				hoverStyle={{ ...hoverUnderlineStyle }}
				pressStyle={{ ...pressUnderlineStyle }}
				currentState={interaction.state}
			/>
		</InteractiveBase>
	</View>
  );
};


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
	const { colors } = useTheme();
	const interaction = useInteractionState();

	return (
		<>
			<View style={{margin: 30}}>
				<AnimatedLink text="coucou Je suis un link zosidjofsijdfosijfosifdjo" onPress={() => console.log("Je suis le lien !!!")}/>
				<InteractiveBase {...interaction} style={{ marginTop: 20 }}>
					<AnimatedBase
						defaultStyle={{
							backgroundColor: colors.primary[300],
						}}
						hoverStyle={{
							backgroundColor: colors.primary[900],
						}}
						pressStyle={{
							backgroundColor: colors.primary[100],
						}}
						currentState={interaction.state}
					>
						<Text>
							Text
						</Text>
					</AnimatedBase>
				</InteractiveBase>
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
			</View>
			<MusicListCC
				data={likedSongs.data?.map((x) => x.song)}
				isLoading={likedSongs.isLoading}
				refetch={likedSongs.refetch}
			/>
		</>
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
