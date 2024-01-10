/* eslint-disable no-mixed-spaces-and-tabs */
import { View, Image, Pressable, useColorScheme, ViewStyle } from 'react-native';
import { Divider, Text, ScrollView, Row, useMediaQuery, useTheme } from 'native-base';
import { useAssets } from 'expo-asset';
import { useQuery } from '../../Queries';
import API from '../../API';
import ButtonBase from './ButtonBase';
import { Icon } from 'iconsax-react-native';
import { LoadingView } from '../Loading';
import { Translate, translate } from '../../i18n/i18n';
import { useNavigation } from '../../Navigation';
import Spacer from './Spacer';
import LogoutButtonCC from './LogoutButtonCC';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ReactElement } from 'react';
import { NavigationState } from '@react-navigation/native';

// TODO a tester avec un historique de plus de 3 musics différente mdr !!
const SongHistory = (props: { quantity: number }) => {
	const history = useQuery(API.getUserPlayHistory);
	const navigation = useNavigation();

	if (!history.data || history.isLoading) {
		return <LoadingView />;
	}

	const musics = history.data
		.reduce(
			(acc, curr) => {
				if (acc.length === 0) {
					return [curr];
				}
				if (acc.find((h) => h.song!.id === curr.song!.id)) {
					return acc;
				}
				return [...acc, curr];
			},
			[] as typeof history.data
		)
		.map((h) => h.song)
		?.slice(0, props.quantity);

	return (
		<View>
			{musics.length === 0 ? (
				<Translate
					style={{ paddingHorizontal: 16 }}
					translationKey="menuNoSongsPlayedYet"
				/>
			) : (
				musics.map((song) => (
					<View
						key={'short-history-tab' + song!.id}
						style={{
							paddingHorizontal: 16,
							paddingVertical: 10,
							flex: 1,
						}}
					>
						<Pressable
							onPress={() => navigation.navigate('Play', { songId: song!.id })}
						>
							<Text numberOfLines={1}>{song!.name}</Text>
						</Pressable>
					</View>
				))
			)}
		</View>
	);
};

const NavigationButton = ({
	isSmallScreen,
	label,
	icon,
	isFocused,
	navigation,
	route,
}: {
	isSmallScreen: boolean;
	label: string;
	icon?: Icon;
	isFocused: boolean;
	navigation: BottomTabBarProps['navigation'];
	route: NavigationState['routes'][0];
}) => {
	return (
		<View key={'key-menu-link-' + label}>
			<ButtonBase
				style={!isSmallScreen ? { width: '100%' } : {}}
				type="menu"
				icon={icon}
				title={!isSmallScreen ? translate(label as any) : undefined}
				isDisabled={isFocused}
				iconVariant={isFocused ? 'Bold' : 'Outline'}
				onPress={() => {
					const event = navigation.emit({
						type: 'tabPress',
						target: route.key,
						canPreventDefault: true,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name, route.params);
					}
				}}
				onLongPress={() => {
					navigation.emit({
						type: 'tabLongPress',
						target: route.key,
					});
				}}
			/>
			<Spacer height="xs" />
		</View>
	);
};

const ScaffoldDesktopCC = ({
	state,
	descriptors,
	navigation,
	children,
	style,
}: Omit<BottomTabBarProps, 'insets'> & { children: ReactElement; style?: ViewStyle }) => {
	const user = useQuery(API.getUserInfo);
	const [isSmallScreen] = useMediaQuery({ maxWidth: 1100 });
	const { colors } = useTheme();
	const colorScheme = useColorScheme();
	const [logo] = useAssets(
		colorScheme == 'light'
			? require('../../assets/icon_light.png')
			: require('../../assets/icon_dark.png')
	);

	return (
		<View style={[{ height: '100%', flexDirection: 'row', overflow: 'hidden' }, style]}>
			<View
				style={{
					display: 'flex',
					width: !isSmallScreen ? 300 : undefined,
					padding: 20,
					flexDirection: 'column',
					justifyContent: 'space-between',
					alignItems: isSmallScreen ? 'center' : 'flex-start',
					flexShrink: 0,
				}}
			>
				<View style={!isSmallScreen ? { width: '100%' } : {}}>
					<Row
						space={2}
						flex={1}
						style={{ justifyContent: isSmallScreen ? 'center' : 'flex-start' }}
					>
						<Image
							source={{ uri: logo?.at(0)?.uri ?? '' }}
							style={{
								aspectRatio: 1,
								width: 32,
								height: 32,
							}}
						/>
						{!isSmallScreen && (
							<Text fontSize={'xl'} selectable={false}>
								ChromaCase
							</Text>
						)}
					</Row>
					<Spacer height="lg" />
					<View>
						{state.routes.map((route, index) => {
							const { options } = descriptors[route.key]!;

							if ((options as any).subMenu) return null;
							return (
								<NavigationButton
									key={route.name}
									isSmallScreen={!!isSmallScreen}
									label={options.title !== undefined ? options.title : route.name}
									icon={options.tabBarIcon as Icon}
									isFocused={state.index === index}
									navigation={navigation}
									route={route}
								/>
							);
						})}
					</View>
				</View>
				{!isSmallScreen && (
					<View style={{ width: '100%' }}>
						<Divider my="2" _light={{ bg: colors.black[500] }} _dark={{ bg: '#FFF' }} />
						<Spacer height="xs" />
						<Text
							bold
							style={{
								paddingHorizontal: 16,
								paddingBottom: 10,
								fontSize: 20,
							}}
						>
							{translate('menuRecentlyPlayed')}
						</Text>
						<SongHistory quantity={3} />
					</View>
				)}
				<Spacer height="xs" />
				<View style={!isSmallScreen ? { width: '100%' } : {}}>
					<Divider my="2" _light={{ bg: colors.black[500] }} _dark={{ bg: '#FFF' }} />
					<Spacer height="xs" />
					{state.routes.map((route, index) => {
						const { options } = descriptors[route.key]!;

						if (!(options as any).subMenu) return null;
						return (
							<NavigationButton
								key={route.key}
								isSmallScreen={!!isSmallScreen}
								label={options.title !== undefined ? options.title : route.name}
								icon={options.tabBarIcon as Icon}
								isFocused={state.index === index}
								navigation={navigation}
								route={route}
							/>
						);
					})}
					<Spacer height="xs" />
					<LogoutButtonCC
						collapse={isSmallScreen}
						isGuest={user.data?.isGuest}
						style={!isSmallScreen ? { width: '100%' } : {}}
						buttonType={'menu'}
					/>
				</View>
			</View>
			<ScrollView
				style={{ flex: 1, maxHeight: '100%' }}
				contentContainerStyle={{
					flex: 1,
					backgroundColor: colors.coolGray[500],
					margin: 8,
					padding: 20,
					borderRadius: 12,
					// Become the same height as the child so if the child has overflow: auto, the child's scrollbar
					// is hidden and we use this component's scrollbar.
					minHeight: 'auto',
				}}
			>
				{children}
			</ScrollView>
		</View>
	);
};

export default ScaffoldDesktopCC;
