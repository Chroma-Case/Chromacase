import { View, Image } from 'react-native';
import { Divider, Text, ScrollView, Flex, Row, Popover, Heading, Button, useBreakpointValue } from 'native-base';
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
import ScaffoldDesktopCC from './ScaffoldDesktopCC';
import ScaffoldMobileCC from './ScaffoldMobileCC';

const menu: {
	type: "main" | "sub";
	title: string;
	icon: Icon;
	link: string;
}[] = [
	{ type: "main", title: 'Discovery', icon: Discover, link: 'HomeNew' },
	{ type: "main", title: 'Profile', icon: User, link: 'User' },
	{ type: "main", title: 'Music', icon: Music, link: 'Home' },
	{ type: "main", title: 'Search', icon: SearchNormal1, link: 'Search' },
	{ type: "main", title: 'LeaderBoard', icon: Cup, link: 'Score' },
	{ type: "sub", title: 'Settings', icon: Setting2, link: 'Settings' },
];

type ScaffoldCCProps = {
	children?: React.ReactNode;
	routeName: string;
	withPadding?: boolean;
};

const ScaffoldCC = ({children, routeName, withPadding = true}: ScaffoldCCProps) => {
	const userQuery = useQuery(API.getUserInfo);
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });

	if (!userQuery.data || userQuery.isLoading) {
		return <LoadingView />;
	}
	const colorScheme = useColorScheme();
	const logo = colorScheme == 'light'
	? require('../../assets/icon_light.png')
	: require('../../assets/icon_dark.png');

	return (
		<Flex style={{ flex: 1, backgroundColor: '#cdd4fd' }}>
			{screenSize === 'small' ?
				<ScaffoldMobileCC
					user={userQuery.data}
					logo={logo}
					routeName={routeName}
					menu={menu}
				>
					{children}
				</ScaffoldMobileCC>
				: <ScaffoldDesktopCC
					user={userQuery.data}
					logo={logo}
					routeName={routeName}
					menu={menu}
					widthPadding={withPadding}
				>
					{children}
				</ScaffoldDesktopCC>
			}
			{colorScheme === 'dark' &&
				<LinearGradient
					colors={['#101014', '#6075F9']}
					style={{
						width: '100%',
						height: '100%',
						position: 'absolute',
						zIndex: -2,
					}}
				/>
			}
		</Flex>
	);
};

export default ScaffoldCC;
