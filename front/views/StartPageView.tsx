/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { useNavigation } from '../Navigation';
import {
	View,
	Text,
	Stack,
	Box,
	useToast,
	Column,
	useBreakpointValue,
	Image,
	Link,
	Center,
	Row,
	Heading,
	Icon,
} from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import BigActionButton from '../components/BigActionButton';
import API, { APIError } from '../API';
import { setAccessToken } from '../state/UserSlice';
import { useDispatch } from '../state/Store';
import { translate } from '../i18n/i18n';
import useColorScheme from '../hooks/colorScheme';
import { useAssets } from 'expo-asset';

const handleGuestLogin = async (apiSetter: (accessToken: string) => void): Promise<string> => {
	const apiAccess = await API.createAndGetGuestAccount();
	apiSetter(apiAccess);
	return translate('loggedIn');
};

const StartPageView = () => {
	const navigation = useNavigation();
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isSmallScreen = screenSize === 'small';
	const dispatch = useDispatch();
	const colorScheme = useColorScheme();
	const toast = useToast();
	const [icon] = useAssets(
		colorScheme == 'light'
			? require('../assets/icon_light.png')
			: require('../assets/icon_dark.png')
	);
	const [loginBanner] = useAssets(require('../assets/auth/login_banner.png'));
	const [guestBanner] = useAssets(require('../assets/auth/guest_banner.png'));
	const [registerBanner] = useAssets(require('../assets/auth/register_banner.png'));

	return (
		<View
			style={{
				width: '100%',
				height: '100%',
			}}
		>
			<Center>
				<Row
					style={{
						alignItems: 'center',
						justifyContent: 'center',
						marginTop: 20,
					}}
					space={3}
				>
					<Icon
						as={
							<Image
								alt="Chromacase logo"
								// source={{ uri: titleBanner?.at(0)?.uri }}
								source={{ uri: icon?.at(0)?.uri }}
							/>
						}
						size={isSmallScreen ? '5xl' : '6xl'}
					/>
					<Heading fontSize={isSmallScreen ? '3xl' : '5xl'}>Chromacase</Heading>
				</Row>
			</Center>
			<Stack
				direction={screenSize === 'small' ? 'column' : 'row'}
				style={{
					width: '100%',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<BigActionButton
					title="Authenticate"
					subtitle="Save and resume your learning at anytime on all devices"
					image={loginBanner?.at(0)?.uri}
					iconName="user"
					iconProvider={FontAwesome5}
					onPress={() => navigation.navigate('Login', {})}
					style={{
						width: isSmallScreen ? '90%' : 'clamp(100px, 33.3%, 600px)',
						height: '300px',
						margin: 'clamp(10px, 2%, 50px)',
					}}
				/>
				<BigActionButton
					title="Test Chromacase"
					subtitle="Use a guest account to see around but your progression won't be saved"
					image={guestBanner?.at(0)?.uri}
					iconName="user-clock"
					iconProvider={FontAwesome5}
					onPress={() => {
						try {
							handleGuestLogin((accessToken: string) => {
								dispatch(setAccessToken(accessToken));
							});
						} catch (error) {
							if (error instanceof APIError) {
								toast.show({ description: translate(error.userMessage) });
								return;
							}
							toast.show({ description: error as string });
						}
					}}
					style={{
						width: isSmallScreen ? '90%' : 'clamp(100px, 33.3%, 600px)',
						height: '300px',
						margin: 'clamp(10px, 2%, 50px)',
					}}
				/>
			</Stack>
			<Center>
				<BigActionButton
					title="Register"
					image={registerBanner?.at(0)?.uri}
					subtitle="Create an account to save your progress"
					iconProvider={FontAwesome5}
					iconName="user-plus"
					onPress={() => navigation.navigate('Signup', {})}
					style={{
						height: '150px',
						width: isSmallScreen ? '90%' : 'clamp(150px, 50%, 600px)',
					}}
				/>
			</Center>
			<Column
				style={{
					width: '100%',
					marginTop: 40,
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<Box
					style={{
						maxWidth: '90%',
					}}
				>
					<Heading fontSize="4xl" style={{ textAlign: 'center' }}>
						What is Chromacase?
					</Heading>
					<Text fontSize={'xl'}>
						Chromacase is a free and open source project that aims to provide a complete
						learning experience for anyone willing to learn piano.
					</Text>
				</Box>

				<Box
					style={{
						width: '90%',
						marginTop: 20,
					}}
				>
					<Box
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<Link href="http://eip.epitech.eu/2024/chromacase" isExternal>
							Click here for more info
						</Link>
					</Box>
				</Box>
			</Column>
		</View>
	);
};

export default StartPageView;
