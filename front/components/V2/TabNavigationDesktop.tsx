import { View, Image } from 'react-native';
import { Divider, Text, Center } from 'native-base';
import TabNavigationButton from './TabNavigationButton';
import TabNavigationList from './TabNavigationList';
import { useAssets } from 'expo-asset';
import useColorScheme from '../../hooks/colorScheme';
import { NaviTab } from './TabNavigation';

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
	// settings is displayed separately (with logout)
	const buttons = props.tabs.filter((tab) => tab.id !== 'settings');

	const others = [
		{
			label: 'Recently played',
		},
		{
			label: 'Short',
		},
		{ label: 'Twinkle Twinkle' },
	];

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
							padding: '10px',
						}}
					>
						<Image
							source={{ uri: icon?.at(0)?.uri }}
							style={{
								aspectRatio: 1,
								width: '40px',
								height: 'auto',
								marginRight: '10px',
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
						width: '300px',
						height: 'auto',
						padding: '32px',
						flexDirection: 'column',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
						flexGrow: 1,
					}}
				>
					<TabNavigationList
						style={{
							flexShrink: 0,
							// @ts-expect-error gap is not in the types because we have an old version of react-native
							gap: '20px',
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
							{others.map((other, index) => (
								<View
									key={'tab-navigation-other-' + index}
									style={{
										paddingHorizontal: '16px',
										paddingVertical: '10px',
									}}
								>
									<Text>{other.label}</Text>
								</View>
							))}
						</TabNavigationList>
						<Divider />
						<TabNavigationList
							style={{
								// @ts-expect-error gap is not in the types because we have an old version of react-native
								gap: '20px',
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
			<View style={{
				height: '100%',
				width: 'calc(100% - 300px)',
			}}>{props.children}</View>
		</View>
	);
};

export default TabNavigationDesktop;
