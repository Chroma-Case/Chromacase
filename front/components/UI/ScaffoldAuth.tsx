import { LinearGradient } from 'expo-linear-gradient';
import { Center, Flex, Stack, View, Text, Wrap, Image } from 'native-base';
import { FunctionComponent } from 'react';
import { Linking, useWindowDimensions } from 'react-native';
import ButtonBase from './ButtonBase';
import { translate } from '../../i18n/i18n';
import API from '../../API';
import SeparatorBase from './SeparatorBase';
import LinkBase from './LinkBase';
import ImageBanner from '../../assets/banner.jpg';

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

	return (
		<Flex
			direction="row"
			justifyContent="space-between"
			style={{ flex: 1, backgroundColor: '#101014' }}
		>
			<Center style={{ flex: 1 }}>
				<View style={{ width: '100%', maxWidth: 420, padding: 16 }}>
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
			</Center>
			{layout.width > 650 ? (
				<View style={{ width: '50%', height: '100%', padding: 16 }}>
					<Image
						source={ImageBanner}
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
