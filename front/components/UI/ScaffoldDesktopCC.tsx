/* eslint-disable no-mixed-spaces-and-tabs */
import { View, Image, TouchableOpacity } from 'react-native';
import { Divider, Text, ScrollView, Row, useMediaQuery, useTheme } from 'native-base';
import { useQuery, useQueries } from '../../Queries';
import API from '../../API';
import Song from '../../models/Song';
import ButtonBase from './ButtonBase';
import { Icon } from 'iconsax-react-native';
import { LoadingView } from '../Loading';
import { TranslationKey, translate } from '../../i18n/i18n';
import { useNavigation } from '../../Navigation';
import Spacer from './Spacer';
import User from '../../models/User';
import LogoutButtonCC from './LogoutButtonCC';
import GlassmorphismCC from './Glassmorphism';

type ScaffoldDesktopCCProps = {
	widthPadding: boolean;
	children?: React.ReactNode;
	user: User;
	logo: string;
	routeName: string;
	menu: readonly {
		type: 'main' | 'sub';
		title: TranslationKey;
		icon: Icon;
		link: string;
	}[];
};

// TODO a tester avec un historique de plus de 3 musics différente mdr !!
const SongHistory = (props: { quantity: number }) => {
	const playHistoryQuery = useQuery(API.getUserPlayHistory);
	const songHistory = useQueries(
		playHistoryQuery.data?.map(({ songID }) => API.getSong(songID)) ?? []
	);
	const navigation = useNavigation();

	const musics = songHistory
		.map((h) => h.data)
		.filter((data): data is Song => data !== undefined)
		.filter((song, i, array) => array.map((s) => s.id).findIndex((id) => id == song.id) == i)
		?.slice(0, props.quantity)
		.map((song: Song) => (
			<View
				key={'short-history-tab' + song.id}
				style={{
					paddingHorizontal: 16,
					paddingVertical: 10,
					flex: 1,
				}}
			>
				<TouchableOpacity onPress={() => navigation.navigate('Song', { songId: song.id })}>
					<Text numberOfLines={1}>{song.name}</Text>
				</TouchableOpacity>
			</View>
		));

	if (!playHistoryQuery.data || playHistoryQuery.isLoading || !songHistory) {
		return <LoadingView />;
	}

	return (
		<View>
			{musics.length === 0 ? (
				<Text style={{ paddingHorizontal: 16 }}>{translate('menuNoSongsPlayedYet')}</Text>
			) : (
				musics
			)}
		</View>
	);
};

const ScaffoldDesktopCC = (props: ScaffoldDesktopCCProps) => {
	const navigation = useNavigation();
	const userQuery = useQuery(API.getUserInfo);
	const [isSmallScreen] = useMediaQuery({ maxWidth: 1100 });
	const { colors } = useTheme();

	if (!userQuery.data || userQuery.isLoading) {
		return <LoadingView />;
	}

	return (
		<View style={{ height: '100%', flexDirection: 'row', overflow: 'hidden' }}>
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
							source={{ uri: props.logo }}
							style={{
								aspectRatio: 1,
								width: 32,
								height: 32,
							}}
						/>
						{!isSmallScreen && (
							<Text fontSize={'xl'} selectable={false}>
								Chromacase
							</Text>
						)}
					</Row>
					<Spacer height="lg" />
					<View>
						{props.menu.map(
							(value) =>
								value.type === 'main' && (
									<View key={'key-menu-link-' + value.title}>
										<ButtonBase
											style={!isSmallScreen ? { width: '100%' } : {}}
											type="menu"
											icon={value.icon}
											title={
												!isSmallScreen
													? translate(
															value.title as
																| 'menuDiscovery'
																| 'menuProfile'
																| 'menuMusic'
																| 'menuSearch'
																| 'menuLeaderBoard'
																| 'menuSettings'
													  )
													: undefined
											}
											isDisabled={props.routeName === value.link}
											iconVariant={
												props.routeName === value.link ? 'Bold' : 'Outline'
											}
											onPress={async () =>
												navigation.navigate(value.link as never)
											}
										/>
										<Spacer height="xs" />
									</View>
								)
						)}
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
					{props.menu.map(
						(value) =>
							value.type === 'sub' && (
								<ButtonBase
									key={'key-menu-link-' + value.title}
									style={!isSmallScreen ? { width: '100%' } : {}}
									type="menu"
									icon={value.icon}
									title={
										!isSmallScreen
											? translate(
													value.title as
														| 'menuDiscovery'
														| 'menuProfile'
														| 'menuMusic'
														| 'menuSearch'
														| 'menuLeaderBoard'
														| 'menuSettings'
											  )
											: undefined
									}
									isDisabled={props.routeName === value.link}
									iconVariant={
										props.routeName === value.link ? 'Bold' : 'Outline'
									}
									onPress={async () => navigation.navigate(value.link as never)}
								/>
							)
					)}
					<Spacer height="xs" />
					<LogoutButtonCC
						collapse={isSmallScreen}
						isGuest={props.user.isGuest}
						style={!isSmallScreen ? { width: '100%' } : {}}
						buttonType={'menu'}
					/>
				</View>
			</View>
			<ScrollView style={{ flex: 1, maxHeight: '100%' }} contentContainerStyle={{ flex: 1 }}>
				<GlassmorphismCC
					style={{
						backgroundColor: colors.coolGray[500],
						flex: 1,
						margin: 8,
						marginBottom: 0,
						marginLeft: 0,
						padding: props.widthPadding ? 20 : 0,
						borderRadius: 12,
						minHeight: 'auto',
					}}
				>
					{props.children}
				</GlassmorphismCC>
				<Spacer height="xs" />
			</ScrollView>
		</View>
	);
};

export default ScaffoldDesktopCC;
