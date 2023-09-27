import { View, useWindowDimensions } from 'react-native';
import {  ScrollView, Flex, useBreakpointValue, useMediaQuery } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonBase from './ButtonBase';
import { Icon } from 'iconsax-react-native';
import { useNavigation } from '../../Navigation';
import Spacer from './Spacer';
import User from '../../models/User';

type ScaffoldMobileCCProps = {
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

const ScaffoldMobileCC = (props: ScaffoldMobileCCProps) => {
	const navigation = useNavigation();
	const [isSmallScreen] = useMediaQuery({ maxWidth: 400 });


	console.log(isSmallScreen);

	return (
		<Flex style={{ flex: 1 }}>
			<View style={{ height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
				<ScrollView
					style={{
						flex: 1,
						maxHeight: '100vh',
						flexDirection: 'column',
						flexShrink: 0,
						padding: 16
					}}
					contentContainerStyle={{ flex: 1 }}
				>
					<View style={{ flex: 1, minHeight: 'fit-content' }}>
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
							backgroundColor: 'rgba(16,16,20,0.5)',
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
								title={props.routeName === value.link && !isSmallScreen ? value.title : undefined}
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

export default ScaffoldMobileCC;
