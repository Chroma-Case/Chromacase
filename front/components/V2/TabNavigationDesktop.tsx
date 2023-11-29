import { View, Image } from 'react-native';
import { Divider, Text, Center, ScrollView } from 'native-base';
import TabNavigationButton from './TabNavigationButton';
import TabNavigationList from './TabNavigationList';
import { useAssets } from 'expo-asset';
import useColorScheme from '../../hooks/colorScheme';
import { useQuery } from '../../Queries';
import { NaviTab } from './TabNavigation';
import API from '../../API';
import Song from '../../models/Song';

type TabNavigationDesktopProps = {
	tabs: NaviTab[];
	isCollapsed: boolean;
	setIsCollapsed: (isCollapsed: boolean) => void;
	activeTabID: string;
	setActiveTabID: (id: string) => void;
	children?: React.ReactNode;
};

const TabNavigationDesktop = (props: TabNavigationDesktopProps) => {
	const colorScheme = useColorScheme();
	const [icon] = useAssets(
		colorScheme == 'light'
			? require('../../assets/icon_light.png')
			: require('../../assets/icon_dark.png')
	);
	const history = useQuery(API.getUserPlayHistory);
	// settings is displayed separately (with logout)
	const buttons = props.tabs.filter((tab) => tab.id !== 'settings');

	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'row',
				width: '100%',
				height: '100%',
			}}
		>
			<View>
				<Center>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'flex-start',
							flexShrink: 0,
							padding: 10,
						}}
					>
						<Image
							source={{ uri: icon?.at(0)?.uri }}
							style={{
								aspectRatio: 1,
								width: 40,
								height: 'auto',
								marginRight: 10,
							}}
						/>
						<Text fontSize={'2xl'} selectable={false}>
							Chromacase
						</Text>
					</View>
				</Center>
				<View
					style={{
						display: 'flex',
						width: 300,
						height: 'auto',
						padding: 32,
						flexDirection: 'column',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
						flexGrow: 1,
					}}
				>
					<TabNavigationList
						style={{
							flexShrink: 0,
							gap: 20,
						}}
					>
						{buttons.map((button, index) => (
							<TabNavigationButton
								key={'tab-navigation-button-' + index}
								icon={button.icon}
								label={button.label}
								isActive={button.id == props.activeTabID}
								onPress={button.onPress}
								onLongPress={button.onLongPress}
								isCollapsed={props.isCollapsed}
							/>
						))}
					</TabNavigationList>
					<TabNavigationList>
						<Divider />
						<TabNavigationList>
							<Text
								bold
								style={{
									paddingHorizontal: 16,
									paddingVertical: 10,
									fontSize: 20,
								}}
							>
								Recently played
							</Text>
							{history.data?.length === 0 && (
								<Text
									style={{
										paddingHorizontal: 16,
										paddingVertical: 10,
									}}
								>
									No songs played yet
								</Text>
							)}
							{history.data
								?.map(x => x.song)
								.filter(
									(song, i, array) =>
										array.map((s) => s.id).findIndex((id) => id == song.id) == i
								)
								.slice(0, 4)
								.map((histoItem, index) => (
									<View
										key={'tab-navigation-other-' + index}
										style={{
											paddingHorizontal: 16,
											paddingVertical: 10,
										}}
									>
										<Text numberOfLines={1}>{histoItem.name}</Text>
									</View>
								))}
						</TabNavigationList>
						<Divider />
						<TabNavigationList
							style={{
								gap: 20,
							}}
						>
							{([props.tabs.find((t) => t.id === 'settings')] as NaviTab[]).map(
								(button, index) => (
									<TabNavigationButton
										key={'tab-navigation-setting-button-' + index}
										icon={button.icon}
										label={button.label}
										isActive={button.id == props.activeTabID}
										onPress={button.onPress}
										onLongPress={button.onLongPress}
										isCollapsed={props.isCollapsed}
									/>
								)
							)}
						</TabNavigationList>
					</TabNavigationList>
				</View>
			</View>
			<ScrollView
				// @ts-expect-error Raw CSS
				style={{
					height: '100%',
					width: 'calc(100% - 300px)',
				}}
			>
				{props.children}
			</ScrollView>
		</View>
	);
};

export default TabNavigationDesktop;
