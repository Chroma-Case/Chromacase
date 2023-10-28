import { View, Image } from 'react-native';
import { Divider, Text, ScrollView, Flex, Row, Popover, Heading, Button } from 'native-base';
import useColorScheme from '../../hooks/colorScheme';
import { useQuery, useQueries } from '../../Queries';
import API from '../../API';
import Song from '../../models/Song';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonBase from './ButtonBase';
import {
	Cup,
	Discover,
	Icon,
	LogoutCurve,
	Music,
	SearchNormal1,
	Setting2,
	User,
} from 'iconsax-react-native';
import { useDispatch } from 'react-redux';
import { LoadingView } from '../Loading';
import { translate } from '../../i18n/i18n';
import { unsetAccessToken } from '../../state/UserSlice';
import { useNavigation } from '../../Navigation';
import Spacer from './Spacer';

const menu: {
	title: string;
	icon: Icon;
	link: string;
}[] = [
	{ title: 'Discovery', icon: Discover, link: 'HomeNew' },
	{ title: 'Profile', icon: User, link: 'User' },
	{ title: 'Music', icon: Music, link: 'Home' },
	{ title: 'Search', icon: SearchNormal1, link: 'Search' },
	{ title: 'LeaderBoard', icon: Cup, link: 'Score' },
];

type ScaffoldCCProps = {
	children?: React.ReactNode;
	routeName: string;
};

const ScaffoldCC = (props: ScaffoldCCProps) => {
	const navigation = useNavigation();
	const userQuery = useQuery(API.getUserInfo);
	const dispatch = useDispatch();

	if (!userQuery.data || userQuery.isLoading) {
		return <LoadingView />;
	}
	const user = userQuery.data;
	const layout = useWindowDimensions();
	const colorScheme = useColorScheme();
	const logo =
		colorScheme == 'light'
			? require('../../assets/icon_light.png')
			: require('../../assets/icon_dark.png');
	const playHistoryQuery = useQuery(API.getUserPlayHistory);
	const songHistory = useQueries(
		playHistoryQuery.data?.map(({ songID }) => API.getSong(songID)) ?? []
	);

	return (
		<Flex style={{ flex: 1 }}>
			<View style={{ height: '100%', flexDirection: 'row', overflow: 'hidden' }}>
				<View
					style={{
						display: 'flex',
						width: '300px',
						height: '100vh',
						maxHeight: '100vh',
						padding: '32px',
						flexDirection: 'column',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
						flexShrink: 0,
					}}
				>
					<View style={{ width: '100%' }}>
						<Row>
							<Image
								source={{ uri: logo }}
								style={{
									aspectRatio: 1,
									width: 32,
									height: 32,
								}}
							/>
							{layout.width > 650 && (
								<Text fontSize={'xl'} selectable={false}>
									Chromacase
								</Text>
							)}
						</Row>
						<Spacer height="xl" />
						<View style={{ width: '100%' }}>
							{menu.map((value) => (
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
									<Spacer />
								</View>
							))}
						</View>
					</View>
					<View style={{ width: '100%' }}>
						<Divider />
						<Spacer />
						<Text
							bold
							style={{
								paddingHorizontal: '16px',
								paddingVertical: '10px',
								fontSize: 20,
							}}
						>
							Recently played
						</Text>
						{songHistory.length === 0 && (
							<Text
								style={{
									paddingHorizontal: '16px',
									paddingVertical: '10px',
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
										paddingHorizontal: '16px',
										paddingVertical: '10px',
									}}
								>
									<Text numberOfLines={1}>{histoItem.name}</Text>
								</View>
							))}
					</View>
					<Spacer />
					<View style={{ width: '100%' }}>
						<Divider />
						<Spacer />
						<ButtonBase
							style={{ width: '100%' }}
							title="Settings"
							icon={Setting2}
							type="menu"
							isDisabled={props.routeName === 'Settings'}
							iconVariant={props.routeName === 'Settings' ? 'Bold' : 'Outline'}
							onPress={async () => navigation.navigate('Settings')}
						/>
						<Spacer />
						{!user.isGuest && (
							<ButtonBase
								style={{ width: '100%' }}
								icon={LogoutCurve}
								title={translate('signOutBtn')}
								type="menu"
								onPress={async () => {
									dispatch(unsetAccessToken());
								}}
							/>
						)}

						{user.isGuest && (
							<Popover
								trigger={(triggerProps) => (
									<ButtonBase {...triggerProps}>
										{translate('signOutBtn')}
									</ButtonBase>
								)}
							>
								<Popover.Content>
									<Popover.Arrow />
									<Popover.Body>
										<Heading size="md" mb={2}>
											{translate('Attention')}
										</Heading>
										<Text>
											{translate(
												'YouAreCurrentlyConnectedWithAGuestAccountWarning'
											)}
										</Text>
										<Button.Group variant="ghost" space={2}>
											<Button
												onPress={() => dispatch(unsetAccessToken())}
												colorScheme="red"
											>
												{translate('signOutBtn')}
											</Button>
											<Button
												onPress={() => {
													navigation.navigate('Login');
												}}
												colorScheme="green"
											>
												{translate('signUpBtn')}
											</Button>
										</Button.Group>
									</Popover.Body>
								</Popover.Content>
							</Popover>
						)}
					</View>
				</View>
				<ScrollView
					style={{ flex: 1, maxHeight: '100vh' }}
					contentContainerStyle={{ flex: 1 }}
				>
					<View
						style={{
							backgroundColor: 'rgba(16,16,20,0.5)',
							flex: 1,
							margin: 8,
							padding: 20,
							borderRadius: 12,
							minHeight: 'fit-content',
						}}
					>
						{props.children}
					</View>
				</ScrollView>
			</View>
			<LinearGradient
				colors={['#101014', '#6075F9']}
				style={{
					width: '100%',
					height: '100%',
					position: 'absolute',
					zIndex: -2,
				}}
			/>
		</Flex>
	);
};

export default ScaffoldCC;
