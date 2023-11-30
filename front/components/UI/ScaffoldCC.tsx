import { Flex, useBreakpointValue } from 'native-base';
import useColorScheme from '../../hooks/colorScheme';
import { useQuery } from '../../Queries';
import API from '../../API';
import { LinearGradient } from 'expo-linear-gradient';
import { Discover, Music, SearchNormal1, Setting2, User } from 'iconsax-react-native';
import { LoadingView } from '../Loading';
import ScaffoldDesktopCC from './ScaffoldDesktopCC';
import ScaffoldMobileCC from './ScaffoldMobileCC';

const menu = [
	{ type: 'main', title: 'menuDiscovery', icon: Discover, link: 'HomeNew' },
	{ type: 'main', title: 'menuProfile', icon: User, link: 'User' },
	{ type: 'main', title: 'menuMusic', icon: Music, link: 'Music' },
	{ type: 'main', title: 'menuSearch', icon: SearchNormal1, link: 'Search' },
	{ type: 'sub', title: 'menuSettings', icon: Setting2, link: 'Settings' },
] as const;

type ScaffoldCCProps = {
	children?: React.ReactNode;
	routeName: string;
	withPadding?: boolean;
	enableScroll?: boolean;
};

const ScaffoldCC = ({
	children,
	routeName,
	withPadding = true,
	enableScroll = true,
}: ScaffoldCCProps) => {
	const userQuery = useQuery(API.getUserInfo);
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });

	if (!userQuery.data || userQuery.isLoading) {
		return <LoadingView />;
	}
	const colorScheme = useColorScheme();
	const logo =
		colorScheme == 'light'
			? require('../../assets/icon_light.png')
			: require('../../assets/icon_dark.png');

	return (
		<Flex style={{ flex: 1, backgroundColor: '#cdd4fd' }}>
			{screenSize === 'small' ? (
				<ScaffoldMobileCC
					enableScroll={enableScroll}
					user={userQuery.data}
					logo={logo}
					routeName={routeName}
					menu={menu}
					widthPadding={withPadding}
				>
					{children}
				</ScaffoldMobileCC>
			) : (
				<ScaffoldDesktopCC
					user={userQuery.data}
					logo={logo}
					routeName={routeName}
					menu={menu}
					widthPadding={withPadding}
				>
					{children}
				</ScaffoldDesktopCC>
			)}
			{colorScheme === 'dark' && (
				<LinearGradient
					colors={['#101014', '#6075F9']}
					style={{
						width: '100%',
						height: '100%',
						position: 'absolute',
						zIndex: -2,
					}}
				/>
			)}
		</Flex>
	);
};

export default ScaffoldCC;
