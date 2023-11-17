import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Column, Flex, Progress, Row, Text, Wrap, useTheme } from 'native-base';
import { RouteProps, useNavigation } from '../Navigation';
import UserAvatar from '../components/UserAvatar';
import { LoadingView } from '../components/Loading';
import { useQuery } from '../Queries';
import API from '../API';
import ButtonBase from '../components/UI/ButtonBase';
import { translate } from '../i18n/i18n';
import ScoreGraph from '../components/ScoreGraph';
import ScaffoldCC from '../components/UI/ScaffoldCC';

function xpToLevel(xp: number): number {
	return Math.floor(xp / 1000);
}

function xpToProgressBarValue(xp: number): number {
	return Math.floor(xp / 10);
}

// eslint-disable-next-line @typescript-eslint/ban-types
const ProfileView = (props: RouteProps<{}>) => {
	const layout = useWindowDimensions();
	const navigation = useNavigation();
	const userQuery = useQuery(API.getUserInfo);

	if (!userQuery.data) {
		return (
			<ScaffoldCC routeName={props.route.name}>
				<LoadingView />
			</ScaffoldCC>
		);
	}

	const progessValue = xpToProgressBarValue(userQuery.data.data.xp);
	const level = xpToLevel(userQuery.data.data.xp);
	const { colors } = useTheme();

	return (
		<ScaffoldCC routeName={props.route.name}>
			<Flex flex={1}>
				<Wrap
					style={{
						flexDirection: layout.width > 650 ? 'row' : 'column',
						alignItems: layout.width > 650 ? 'flex-start' : 'center',
						paddingBottom: 20,
						justifyContent: 'space-between',
					}}
				>
					<UserAvatar size={layout.width > 650 ? 'xl' : '2xl'} />
					<Column
						style={{
							paddingLeft: layout.width > 650 ? 20 : 0,
							paddingTop: layout.width > 650 ? 0 : 20,
							flex: 1,
							width: '100%',
						}}
					>
						<Wrap
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							<Text fontSize={'xl'} style={{ paddingRight: 'auto' }}>
								{userQuery.data.name}
							</Text>
							<ButtonBase
								title="Modifier profil"
								type={'filled'}
								onPress={async () => navigation.navigate('Settings', {})}
							/>
						</Wrap>
						<Text style={{ paddingBottom: 10, fontWeight: 'bold' }}>
							Account created on {userQuery.data.data.createdAt.toLocaleDateString()}
						</Text>
						<Wrap
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								paddingBottom: 10,
							}}
						>
							<Text style={{ paddingRight: 20 }}>
								Your client ID is {userQuery.data.id}
							</Text>
							<Text>{userQuery.data.data.gamesPlayed} Games played</Text>
						</Wrap>
					</Column>
				</Wrap>
				<Row style={{ alignItems: 'center', paddingBottom: 20 }}>
					<Text style={{ paddingRight: 20 }}>{`${translate('level')} ${level}`}</Text>
					<Progress
						bgColor={colors.coolGray[500]}
						value={progessValue}
						maxW={'800'}
						flex={1}
					/>
				</Row>
				<ScoreGraph />
			</Flex>
		</ScaffoldCC>
	);
};

export default ProfileView;
