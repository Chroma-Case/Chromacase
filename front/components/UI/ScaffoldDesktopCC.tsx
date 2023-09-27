import { View, Image } from 'react-native';
import { Divider, Text, ScrollView, Flex, Row, Popover, Heading, Button } from 'native-base';
import { useQuery, useQueries } from '../../Queries';
import API from '../../API';
import Song from '../../models/Song';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonBase from './ButtonBase';
import { Icon, LogoutCurve } from 'iconsax-react-native';
import { useDispatch } from 'react-redux';
import { LoadingView } from '../Loading';
import { translate } from '../../i18n/i18n';
import { unsetAccessToken } from '../../state/UserSlice';
import { useNavigation } from '../../Navigation';
import Spacer from './Spacer';
import User from '../../models/User';

type ScaffoldDesktopCCProps = {
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
	const dispatch = useDispatch();

	if (!userQuery.data || userQuery.isLoading) {
		return <LoadingView />;
	}
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
								source={{ uri: props.logo }}
								style={{
									aspectRatio: 1,
									width: '40px',
									height: 'auto',
									marginRight: '10px',
								}}
							/>
							<Spacer width="xs" />
							<Text fontSize={'2xl'} selectable={false}>
								Chromacase
							</Text>
						</Row>
						<Spacer height="xl" />
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
						{props.menu.map((value) => (
							value.type === "sub" &&
							<ButtonBase
								key={'key-menu-link-' + value.title}
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
						))}
						<Spacer />
						{!props.user.isGuest && (
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

						{props.user.isGuest && (
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
					<Spacer/>
				</ScrollView>
			</View>
			<LinearGradient
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				colors={['#101014', '#6075F9']}
				style={{
					top: 0,
					bottom: 0,
					right: 0,
					left: 0,
					width: '100%',
					height: '100%',
					minHeight: 'fit-content',
					minWidth: 'fit-content',
					flex: 1,
					position: 'absolute',
					zIndex: -2,
				}}
			/>
		</Flex>
	);
};

export default ScaffoldDesktopCC;
