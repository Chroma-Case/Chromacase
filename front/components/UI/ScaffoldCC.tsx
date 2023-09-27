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
};

const ScaffoldCC = (props: ScaffoldCCProps) => {
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });

	const userQuery = useQuery(API.getUserInfo);

	if (!userQuery.data || userQuery.isLoading) {
		return <LoadingView />;
	}
	const colorScheme = useColorScheme();


	if (screenSize === 'small') {
		return (
			<ScaffoldMobileCC
				user={userQuery.data}
				logo={colorScheme == 'light'
				? require('../../assets/icon_light.png')
				: require('../../assets/icon_dark.png')}
				routeName={props.routeName}
				menu={menu}
			>
				{props.children}
			</ScaffoldMobileCC>
		);
	}

	return (
		<ScaffoldDesktopCC
			user={userQuery.data}
			logo={colorScheme == 'light'
			? require('../../assets/icon_light.png')
			: require('../../assets/icon_dark.png')}
			routeName={props.routeName}
			menu={menu}
		>
			{props.children}
		</ScaffoldDesktopCC>
	);
};

export default ScaffoldCC;
