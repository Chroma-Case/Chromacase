import { View, Pressable, Text, Image } from 'react-native';
import { Divider, Text as NBText, Center } from 'native-base';
import TabNavigationButton from './TabNavigationButton';
import TabNavigationList from './TabNavigationList';
import { useAssets } from 'expo-asset';
import useColorScheme from '../../hooks/colorScheme';

const TabNavigation = () => {
	const colorScheme = useColorScheme();
	const [icon] = useAssets(
		colorScheme == 'light'
			? require('../../assets/icon_light.png')
			: require('../../assets/icon_dark.png')
	);
	const buttons = [
		{
			icon: 'icon',
			label: 'label',
			onPress: () => {},
			onLongPress: () => {},
			isActive: true,
		},
		{
			icon: 'icon',
			label: 'salut',
			onPress: () => {},
			onLongPress: () => {},
			isActive: false,
		},
	];

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
						<NBText fontSize={'2xl'} selectable={false}>
							Chromacase
						</NBText>
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
							gap: '20px',
						}}
					>
						{buttons.map((button, index) => (
							<TabNavigationButton
								key={'tab-navigation-button-' + index}
								{...button}
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
								gap: '20px',
							}}
						>
							{[{ label: 'Settings' }, { label: 'Logout' }].map((button, index) => (
								<TabNavigationButton
									key={'tab-navigation-setting-button-' + index}
									{...button}
								/>
							))}
						</TabNavigationList>
					</TabNavigationList>
				</View>
			</View>
			<View>
				<Text>Main content page</Text>
			</View>
		</View>
	);
};

export default TabNavigation;
