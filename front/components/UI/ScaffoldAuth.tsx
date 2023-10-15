import { LinearGradient } from 'expo-linear-gradient';
import { Flex, Stack, View, Text, Wrap, Image, Row, Column, ScrollView, useToast } from 'native-base';
import { FunctionComponent } from 'react';
import { Linking, useWindowDimensions } from 'react-native';
import ButtonBase from './ButtonBase';
import { translate } from '../../i18n/i18n';
import API, { APIError } from '../../API';
import SeparatorBase from './SeparatorBase';
import LinkBase from './LinkBase';
import { useDispatch } from '../../state/Store';
import { setAccessToken } from '../../state/UserSlice';
import useColorScheme from '../../hooks/colorScheme';

const handleGuestLogin = async (apiSetter: (accessToken: string) => void): Promise<string> => {
	const apiAccess = await API.createAndGetGuestAccount();
	apiSetter(apiAccess);
	return translate('loggedIn');
};
import { useAssets } from 'expo-asset';

interface ScaffoldAuthProps {
	title: string;
	description: string;
	form: React.ReactNode[];
	submitButton: React.ReactNode;
	link: { text: string; description: string; onPress: () => void };
}

const ScaffoldAuth: FunctionComponent<ScaffoldAuthProps> = ({
	title,
	description,
	form,
	submitButton,
	link,
}) => {
	const layout = useWindowDimensions();
	const dispatch = useDispatch();
	const toast = useToast();
	const colorScheme = useColorScheme();
	const logo = colorScheme == 'light'
	? require('../../assets/icon_light.png')
	: require('../../assets/icon_dark.png');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const [banner] = useAssets(require('../../assets/banner.jpg'));

	return (
		<Flex
			direction="row"
			justifyContent="space-between"
			style={{ flex: 1, backgroundColor: '#101014' }}
		>
			<Column style={{ flex: 1 }}>
				<Wrap space={4} direction='row' style={{padding: 16, paddingBottom: 0}}>
					<Row space={2} flex={1}>
						<Image
							source={{ uri: logo }}
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
					<ButtonBase
						title='guest mode'
						onPress={async () => {
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
					/>
				</Wrap>
				<ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1, justifyContent: 'center', alignSelf: 'center' }}>
					<View style={{ width: '100%', maxWidth: 420 }}>
						<Stack
							space={8}
							justifyContent="center"
							alignContent="center"
							alignItems="center"
							style={{ width: '100%', paddingBottom: 40 }}
						>
							<Text fontSize="4xl" textAlign="center">
								{title}
							</Text>
							<Text fontSize="lg" textAlign="center">
								{description}
							</Text>
						</Stack>
						<Stack
							space={5}
							justifyContent="center"
							alignContent="center"
							alignItems="center"
							style={{ width: '100%' }}
						>
							<ButtonBase
								style={{ width: '100%' }}
								type="outlined"
								iconImage="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png"
								title={translate('continuewithgoogle')}
								onPress={() => Linking.openURL(`${API.baseUrl}/auth/login/google`)}
							/>
							<SeparatorBase>or</SeparatorBase>
							<Stack
								space={3}
								justifyContent="center"
								alignContent="center"
								alignItems="center"
								style={{ width: '100%' }}
							>
								{form}
							</Stack>
							{submitButton}
							<Wrap style={{ flexDirection: 'row', justifyContent: 'center' }}>
								<Text>{link.description}</Text>
								<LinkBase onPress={link.onPress}>{link.text}</LinkBase>
							</Wrap>
						</Stack>
					</View>
				</ScrollView>
			</Column>
			{layout.width > 650 ? (
				<View style={{ width: '50%', height: '100%', padding: 16 }}>
					<Image
						source={{ uri: banner?.at(0)?.uri }}
						alt="banner page"
						style={{ width: '100%', height: '100%', borderRadius: 8 }}
					/>
				</View>
			) : (
				<></>
			)}
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
					position: 'absolute',
					zIndex: -2,
				}}
			/>
		</Flex>
	);
};

export default ScaffoldAuth;
