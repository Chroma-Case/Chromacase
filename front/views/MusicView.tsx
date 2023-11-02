import React from 'react';
import { Center, HStack, Row, Stack, Text, useBreakpointValue, useTheme } from 'native-base';
import { useWindowDimensions } from 'react-native';
import {
	TabView,
	SceneMap,
	TabBar,
	NavigationState,
	Route,
	SceneRendererProps,
} from 'react-native-tab-view';
import {
	Heart,
	Clock,
	StatusUp,
	FolderCross,
	Chart2,
	ArrowRotateLeft,
	Cup,
	Icon,
} from 'iconsax-react-native';
import { Scene } from 'react-native-tab-view/lib/typescript/src/types';
import useColorScheme from '../hooks/colorScheme';
import { RouteProps } from '../Navigation';
import { translate } from '../i18n/i18n';
import ScaffoldCC from '../components/UI/ScaffoldCC';
import MusicItem from '../components/UI/MusicItem';

interface MusicItemTitleProps {
	text: string;
	icon: Icon;
	isBigScreen: boolean;
}

const MusicItemTitle = (props: MusicItemTitleProps) => {
	const colorScheme = useColorScheme();

	return (
		<Row
			style={{
				display: 'flex',
				flex: 1,
				maxWidth: props.isBigScreen ? 150 : 50,
				height: '100%',
				alignItems: 'center',
				justifyContent: props.isBigScreen ? 'flex-end' : 'center',
			}}
		>
			{props.isBigScreen && (
				<Text fontSize="lg" style={{ paddingRight: 8 }}>
					{props.text}
				</Text>
			)}
			<props.icon
				size={18}
				color={colorScheme === 'light' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'}
			/>
		</Row>
	);
};

export const FavoritesMusic = () => {
	const { colors } = useTheme();
	const screenSize = useBreakpointValue({ base: 'small', md: 'md', xl: 'xl' });
	const isSmallScreen = screenSize === 'small';
	const isBigScreen = screenSize === 'xl';

	return (
		<Stack style={{ gap: 2, borderRadius: 10, overflow: 'hidden' }}>
			<HStack
				space={isSmallScreen ? 1 : 2}
				style={{
					backgroundColor: colors.coolGray[500],
					paddingHorizontal: isSmallScreen ? 8 : 16,
					paddingVertical: 12,
				}}
			>
				<Text
					fontSize="lg"
					style={{ flex: 4, width: '100%', justifyContent: 'center', paddingRight: 60 }}
				>
					Song
				</Text>
				{[
					{ text: 'level', icon: Chart2 },
					{ text: 'lastScore', icon: ArrowRotateLeft },
					{ text: 'BastScore', icon: Cup },
				].map((value) => (
					<MusicItemTitle
						key={value.text + 'key'}
						text={value.text}
						icon={value.icon}
						isBigScreen={isBigScreen}
					/>
				))}
			</HStack>
			<MusicItem
				image={
					'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg'
				}
				liked={false}
				onLike={() => {
					console.log('Liked !');
				}}
				level={3}
				lastScore={25550}
				bestScore={420}
				artist={'Ludwig van Beethoven'}
				song={'Piano Sonata No. 8'}
			/>
			<MusicItem
				image={
					'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg'
				}
				liked={true}
				onLike={() => {
					console.log('Liked !');
				}}
				level={3}
				lastScore={255500000}
				bestScore={42000}
				artist={'Ludwig van Beethoven'}
				song={'Sonata for Piano no. 20 in G major, op. 49 no. 2'}
			/>
		</Stack>
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
	const colorScheme = useColorScheme();
	const { colors } = useTheme();
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isSmallScreen = screenSize === 'small';
	const [routes] = React.useState<Route[]>([
		{ key: 'favorites', title: 'musicTabFavorites' },
		{ key: 'recentlyPlayed', title: 'musicTabRecentlyPlayed' },
		{ key: 'stepUp', title: 'musicTabStepUp' },
	]);
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
			activeColor={colorScheme === 'light' ? '#000' : '#fff'}
			inactiveColor={colorScheme === 'light' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'}
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
						{translate(
							route.title as
								| 'musicTabFavorites'
								| 'musicTabRecentlyPlayed'
								| 'musicTabStepUp'
						)}
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
					padding: isSmallScreen ? 4 : 20,
					paddingTop: 32,
					// maxWidth: 850,
					width: '100%',
				}}
				// style={{ height: 'fit-content' }}
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
