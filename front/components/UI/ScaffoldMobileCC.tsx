import { View } from 'react-native';
import {  ScrollView, Flex, useMediaQuery, useTheme } from 'native-base';
import ButtonBase from './ButtonBase';
import { Icon } from 'iconsax-react-native';
import { useNavigation } from '../../Navigation';
import Spacer from './Spacer';
import User from '../../models/User';
import { translate } from '../../i18n/i18n';

type ScaffoldMobileCCProps = {
	children?: React.ReactNode;
	user: User;
	logo: string;
	routeName: string;
	widthPadding: number;
	menu: {
		type: "main" | "sub";
		title: string;
		icon: Icon;
		link: string;
	}[]
};

const ScaffoldMobileCC = (props: ScaffoldMobileCCProps) => {
	const navigation = useNavigation();
	const [isSmallScreen] = useMediaQuery({ maxWidth: 400 });
	const { colors } = useTheme();

	console.log(isSmallScreen);

	return (
		<View style={{ height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
			<ScrollView
				style={{
					flex: 1,
					maxHeight: '100%',
					flexDirection: 'column',
					flexShrink: 0,
					padding: props.widthPadding ? 8 : 0
				}}
				contentContainerStyle={{ flex: 1 }}
			>
				<View style={{ flex: 1 }}>
					{props.children}
				</View>
				<Spacer/>
			</ScrollView>
			<View style={{padding: 8, paddingTop: 0}}>
				<Flex
					style={{
						width: '100%',
						height: 'fit-content',
						flexDirection: 'row',
						backgroundColor: colors.coolGray[500],
						padding: 8,
						justifyContent: 'space-between',
						borderRadius: 8,
					}}
				>
					{props.menu.map((value) => (
						<ButtonBase
							key={'key-menu-link-' + value.title}
							type="menu"
							icon={value.icon}
							title={props.routeName === value.link && !isSmallScreen ? translate(value.title as 'menuDiscovery' | 'menuProfile' | 'menuMusic' | 'menuSearch' | 'menuLeaderBoard' | 'menuSettings') : undefined}
							isDisabled={props.routeName === value.link}
							iconVariant={
								props.routeName === value.link ? 'Bold' : 'Outline'
							}
							onPress={async () =>
								navigation.navigate(value.link as never)
							}
						/>
					))}
				</Flex>
			</View>
		</View>
	);
};

export default ScaffoldMobileCC;
