import { View, Image, useWindowDimensions } from 'react-native';
import { Divider, Text, ScrollView, Flex, Row, useMediaQuery, useTheme } from 'native-base';
import { useQuery, useQueries } from '../../Queries';
import API from '../../API';
import Song from '../../models/Song';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonBase from './ButtonBase';
import { Icon } from 'iconsax-react-native';
import { LoadingView } from '../Loading';
import { translate } from '../../i18n/i18n';
import { useNavigation } from '../../Navigation';
import Spacer from './Spacer';
import User from '../../models/User';
import LogoutButtonCC from './LogoutButtonCC';
import GlassmorphismCC from './Glassmorphism';
import { ColorSchemeProvider } from '../../Theme';
import useColorScheme from '../../hooks/colorScheme';

type ScaffoldDesktopCCProps = {
	widthPadding: boolean,
	children?: React.ReactNode;
	user: User;
	logo: string;
	routeName: string;
	menu: {
		type: "main" | "sub";
		title: string;
		icon: Icon;
		link: string;
	}[]
};

const ScaffoldDesktopCC = (props: ScaffoldDesktopCCProps) => {
	const navigation = useNavigation();
	const userQuery = useQuery(API.getUserInfo);
	const [isSmallScreen] = useMediaQuery({ maxWidth: 400 });
	const layout = useWindowDimensions();
	const colorScheme = useColorScheme();

	if (!userQuery.data || userQuery.isLoading) {
		return <LoadingView />;
	}
	const playHistoryQuery = useQuery(API.getUserPlayHistory);
	const songHistory = useQueries(
		playHistoryQuery.data?.map(({ songID }) => API.getSong(songID)) ?? []
	);
	const { colors } = useTheme();

	return (
		<View style={{ height: '100%', flexDirection: 'row', overflow: 'hidden' }}>
			<View
				style={{
					display: 'flex',
					width: 300,
					padding: 20,
					flexDirection: 'column',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					flexShrink: 0,
				}}
			>
				<View style={{ width: '100%' }}>
					<Row space={2} flex={1}>
						<Image
							source={{ uri: props.logo }}
							style={{
								aspectRatio: 1,
								width: 32,
								height: 32,
							}}
						/>
						{layout.width > 650 &&
							<Text fontSize={'xl'} selectable={false}>
								Chromacase
							</Text>
						}
					</Row>
					<Spacer height="lg" />
					<View style={{ width: '100%' }}>
						{props.menu.map((value) => (
							value.type === "main" &&
							<View key={'key-menu-link-' + value.title}>
								<ButtonBase
									style={{ width: '100%' }}
									type="menu"
									icon={value.icon}
									title={value.title}
									isDisabled={props.routeName === value.link}
									iconVariant={
										props.routeName === value.link ? 'Bold' : 'Outline'
									}
									onPress={async () =>
										navigation.navigate(value.link as never)
									}
								/>
								<Spacer height='xs'/>
							</View>
						))}
					</View>
				</View>
				<View style={{ width: '100%' }}>
					<Divider my="2" _light={{bg: colors.black[500]}} _dark={{bg:'#FFF'}}/>
					<Spacer height='xs'/>
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
					{songHistory.length === 0 && (
						<Text
							style={{
								paddingHorizontal: 16,
								paddingVertical: 10,
							}}
						>
							No songs played yet
						</Text>
					)}
					{songHistory
						.map((h) => h.data)
						.filter((data): data is Song => data !== undefined)
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
				</View>
				<Spacer height='xs'/>
				<View style={{ width: '100%' }}>
					<Divider my="2" _light={{bg: colors.black[500]}} _dark={{bg: '#FFF'}}/>
					<Spacer height='xs'/>
					{props.menu.map((value) => (
						value.type === "sub" &&
						<ButtonBase
							key={'key-menu-link-' + value.title}
							style={{ width: '100%' }}
							type="menu"
							icon={value.icon}
							title={!isSmallScreen ? value.title : undefined}
							isDisabled={props.routeName === value.link}
							iconVariant={
								props.routeName === value.link ? 'Bold' : 'Outline'
							}
							onPress={async () =>
								navigation.navigate(value.link as never)
							}
						/>
					))}
					<Spacer height='xs'/>
					<LogoutButtonCC isGuest={props.user.isGuest} style={{with: '100%'}} buttonType={'menu'}/>
				</View>
			</View>
			<ScrollView
				style={{ flex: 1, maxHeight: '100vh' }}
				contentContainerStyle={{ flex: 1 }}
			>
				<GlassmorphismCC
					style={{
						backgroundColor: colors.coolGray[500],
						flex: 1,
						margin: 8,
						marginBottom: 0,
						padding: props.widthPadding ? 20 : 0,
						borderRadius: 12,
						minHeight: 'fit-content',
					}}
				>
					{props.children}
				</GlassmorphismCC>
				<Spacer height='xs'/>
			</ScrollView>
		</View>

	);
};

export default ScaffoldDesktopCC;
