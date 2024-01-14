import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Column, Flex, Progress, Row, Text, View, useTheme } from 'native-base';
import { useNavigation } from '../Navigation';
import UserAvatar from '../components/UserAvatar';
import { LoadingView } from '../components/Loading';
import { useQuery } from '../Queries';
import API from '../API';
import ButtonBase from '../components/UI/ButtonBase';
import { Translate, translate } from '../i18n/i18n';
import ScoreGraph from '../components/ScoreGraph';

function xpToLevel(xp: number): number {
	return Math.floor(xp / 1000);
}

function xpToProgressBarValue(xp: number): number {
	return Math.floor(xp / 10);
}

const ProfileView = () => {
	const layout = useWindowDimensions();
	const navigation = useNavigation();
	const userQuery = useQuery(API.getUserInfo);

	if (!userQuery.data) {
		return <LoadingView />;
	}

	const progessValue = xpToProgressBarValue(userQuery.data.data.xp);
	const level = xpToLevel(userQuery.data.data.xp);
	const { colors } = useTheme();

	const isBigScreen = layout.width > 650;

	return (
		<Flex flex={1}>
			<View
				style={{
					display: 'flex',
					flexDirection: isBigScreen ? 'row' : 'column',
					alignItems: isBigScreen ? 'flex-start' : 'center',
					paddingBottom: 20,
					gap: 5,
					justifyContent: 'space-between',
				}}
			>
				<View
					style={{
						flexGrow: 0,
						flexShrink: 0,
					}}
				>
					<UserAvatar size={isBigScreen ? 'xl' : '2xl'} />
				</View>
				<Column
					style={{
						paddingLeft: isBigScreen ? 20 : 0,
						paddingTop: isBigScreen ? 0 : 20,
						flexGrow: 1,
						flexShrink: 1,
						width: '100%',
					}}
				>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Text fontSize={'xl'} style={{ paddingRight: 'auto' }}>
							{userQuery.data.name}
						</Text>
						<ButtonBase
							title={translate('updateProfile')}
							type={'filled'}
							onPress={async () => navigation.navigate('Settings')}
						/>
					</View>
					<Translate
						style={{ fontWeight: 'bold' }}
						translationKey="accountCreatedOn"
						format={(e) => `${e} ${userQuery.data.data.createdAt.toLocaleDateString()}`}
					/>
					<Translate
						style={{ fontWeight: 'bold', paddingBottom: 10 }}
						translationKey="email"
						format={(e) => `${e} ${userQuery.data.email}`}
					/>
					<Flex
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							paddingBottom: 10,
						}}
					>
						<Translate
							translationKey="gamesPlayed"
							format={(e) => `${userQuery.data.data.gamesPlayed} ${e}`}
						/>
					</Flex>
				</Column>
			</View>
			<Row style={{ alignItems: 'center', paddingBottom: 20 }}>
				<Translate
					style={{ paddingRight: 20 }}
					translationKey="level"
					format={(e) => `${e} ${level}`}
				/>
				<Progress
					bgColor={colors.coolGray[500]}
					value={progessValue}
					maxW={'800'}
					flex={1}
				/>
			</Row>
			<ScoreGraph />
		</Flex>
	);
};

export default ProfileView;
