import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Column, Flex, Progress, Row, Text, Wrap } from 'native-base';
import { RouteProps, useNavigation } from '../Navigation';
import UserAvatar from '../components/UserAvatar';
import { LoadingView } from '../components/Loading';
import { useQuery } from '../Queries';
import API from '../API';
import ButtonBase from '../components/UI/ButtonBase';
import { translate } from '../i18n/i18n';
import ScoreGraph from '../components/ScoreGraph';
import ScaffoldCC from '../components/UI/ScaffoldCC';

const fakeData = [
	{
		score: 47,
		songID: 34,
		userID: 18,
		playDate: new Date('2023-08-20 8:27:21'),
		difficulties: 1,
	},
	{
		score: 1,
		songID: 603,
		userID: 18,
		playDate: new Date('2023-09-13 22:56:45'),
		difficulties: 1,
	},
	{
		score: 93,
		songID: 601,
		userID: 18,
		playDate: new Date('2023-08-11 5:30:13'),
		difficulties: 5,
	},
	{
		score: 55,
		songID: 456,
		userID: 18,
		playDate: new Date('2023-07-10 23:06:09'),
		difficulties: 4,
	},
	{
		score: 2,
		songID: 345,
		userID: 18,
		playDate: new Date('2023-07-23 18:33:24'),
		difficulties: 2,
	},
	{
		score: 47,
		songID: 625,
		userID: 18,
		playDate: new Date('2023-07-09 7:16:46'),
		difficulties: 1,
	},
	{
		score: 27,
		songID: 234,
		userID: 18,
		playDate: new Date('2023-07-06 15:56:53'),
		difficulties: 5,
	},
	{
		score: 85,
		songID: 866,
		userID: 18,
		playDate: new Date('2023-07-08 8:56:44'),
		difficulties: 2,
	},
	{
		score: 28,
		songID: 484,
		userID: 18,
		playDate: new Date('2023-09-12 6:05:32'),
		difficulties: 4,
	},
	{
		score: 5,
		songID: 443,
		userID: 18,
		playDate: new Date('2023-08-01 11:57:09'),
		difficulties: 3,
	},
	{
		score: 14,
		songID: 109,
		userID: 18,
		playDate: new Date('2023-07-03 22:54:07'),
		difficulties: 3,
	},
	{
		score: 57,
		songID: 892,
		userID: 18,
		playDate: new Date('2023-07-13 23:22:34'),
		difficulties: 5,
	},
	{
		score: 7,
		songID: 164,
		userID: 18,
		playDate: new Date('2023-07-02 0:15:13'),
		difficulties: 2,
	},
	{
		score: 42,
		songID: 761,
		userID: 18,
		playDate: new Date('2023-07-10 18:25:19'),
		difficulties: 3,
	},
	{
		score: 49,
		songID: 82,
		userID: 18,
		playDate: new Date('2023-09-12 12:51:15'),
		difficulties: 4,
	},
	{
		score: 83,
		songID: 488,
		userID: 18,
		playDate: new Date('2023-08-28 7:56:31'),
		difficulties: 5,
	},
	{
		score: 91,
		songID: 648,
		userID: 18,
		playDate: new Date('2023-07-21 10:16:33'),
		difficulties: 4,
	},
	{
		score: 67,
		songID: 210,
		userID: 18,
		playDate: new Date('2023-09-14 8:04:50'),
		difficulties: 1,
	},
	{
		score: 31,
		songID: 274,
		userID: 18,
		playDate: new Date('2023-07-10 11:24:28'),
		difficulties: 4,
	},
	{
		score: 29,
		songID: 930,
		userID: 18,
		playDate: new Date('2023-08-06 0:05:43'),
		difficulties: 5,
	},
	{
		score: 51,
		songID: 496,
		userID: 18,
		playDate: new Date('2023-08-14 9:43:14'),
		difficulties: 1,
	},
	{
		score: 56,
		songID: 370,
		userID: 18,
		playDate: new Date('2023-08-18 19:25:59'),
		difficulties: 2,
	},
	{
		score: 29,
		songID: 333,
		userID: 18,
		playDate: new Date('2023-07-11 4:26:44'),
		difficulties: 4,
	},
	{
		score: 95,
		songID: 921,
		userID: 18,
		playDate: new Date('2023-08-30 12:58:50'),
		difficulties: 1,
	},
	{
		score: 37,
		songID: 80,
		userID: 18,
		playDate: new Date('2023-07-16 7:17:57'),
		difficulties: 4,
	},
	{
		score: 90,
		songID: 134,
		userID: 18,
		playDate: new Date('2023-09-03 9:00:04'),
		difficulties: 1,
	},
	{
		score: 51,
		songID: 497,
		userID: 18,
		playDate: new Date('2023-07-31 19:34:43'),
		difficulties: 4,
	},
	{
		score: 95,
		songID: 368,
		userID: 18,
		playDate: new Date('2023-09-12 20:12:50'),
		difficulties: 4,
	},
	{
		score: 55,
		songID: 247,
		userID: 18,
		playDate: new Date('2023-09-16 2:45:13'),
		difficulties: 1,
	},
	{
		score: 26,
		songID: 725,
		userID: 18,
		playDate: new Date('2023-07-28 22:59:31'),
		difficulties: 2,
	},
	{
		score: 82,
		songID: 952,
		userID: 18,
		playDate: new Date('2023-08-01 6:31:47'),
		difficulties: 1,
	},
	{
		score: 88,
		songID: 85,
		userID: 18,
		playDate: new Date('2023-08-12 2:33:11'),
		difficulties: 5,
	},
	{
		score: 12,
		songID: 96,
		userID: 18,
		playDate: new Date('2023-09-03 14:00:33'),
		difficulties: 4,
	},
	{
		score: 100,
		songID: 807,
		userID: 18,
		playDate: new Date('2023-07-03 0:53:11'),
		difficulties: 3,
	},
	{
		score: 88,
		songID: 456,
		userID: 18,
		playDate: new Date('2023-08-06 9:17:15'),
		difficulties: 5,
	},
	{
		score: 10,
		songID: 889,
		userID: 18,
		playDate: new Date('2023-08-15 12:19:16'),
		difficulties: 3,
	},
	{
		score: 76,
		songID: 144,
		userID: 18,
		playDate: new Date('2023-09-10 2:56:49'),
		difficulties: 4,
	},
	{
		score: 60,
		songID: 808,
		userID: 18,
		playDate: new Date('2023-07-24 10:22:33'),
		difficulties: 1,
	},
	{
		score: 94,
		songID: 537,
		userID: 18,
		playDate: new Date('2023-08-03 23:22:29'),
		difficulties: 2,
	},
	{
		score: 100,
		songID: 465,
		userID: 18,
		playDate: new Date('2023-09-16 19:12:58'),
		difficulties: 2,
	},
	{
		score: 85,
		songID: 31,
		userID: 18,
		playDate: new Date('2023-08-17 5:29:49'),
		difficulties: 2,
	},
	{
		score: 98,
		songID: 345,
		userID: 18,
		playDate: new Date('2023-09-11 1:51:49'),
		difficulties: 1,
	},
	{
		score: 81,
		songID: 204,
		userID: 18,
		playDate: new Date('2023-08-21 2:46:56'),
		difficulties: 2,
	},
	{
		score: 21,
		songID: 40,
		userID: 18,
		playDate: new Date('2023-07-27 4:00:00'),
		difficulties: 2,
	},
	{
		score: 91,
		songID: 274,
		userID: 18,
		playDate: new Date('2023-07-14 16:09:49'),
		difficulties: 5,
	},
	{
		score: 99,
		songID: 416,
		userID: 18,
		playDate: new Date('2023-08-27 1:56:16'),
		difficulties: 5,
	},
	{
		score: 58,
		songID: 87,
		userID: 18,
		playDate: new Date('2023-09-08 19:30:20'),
		difficulties: 5,
	},
	{
		score: 90,
		songID: 744,
		userID: 18,
		playDate: new Date('2023-08-18 23:47:55'),
		difficulties: 2,
	},
	{
		score: 69,
		songID: 954,
		userID: 18,
		playDate: new Date('2023-08-07 1:55:52'),
		difficulties: 5,
	},
	{
		score: 75,
		songID: 467,
		userID: 18,
		playDate: new Date('2023-07-10 8:37:22'),
		difficulties: 4,
	},
	{
		score: 41,
		songID: 693,
		userID: 18,
		playDate: new Date('2023-09-11 5:15:16'),
		difficulties: 2,
	},
	{
		score: 56,
		songID: 140,
		userID: 18,
		playDate: new Date('2023-08-06 5:32:46'),
		difficulties: 2,
	},
	{
		score: 88,
		songID: 64,
		userID: 18,
		playDate: new Date('2023-07-31 20:24:30'),
		difficulties: 1,
	},
	{
		score: 99,
		songID: 284,
		userID: 18,
		playDate: new Date('2023-08-07 17:51:19'),
		difficulties: 5,
	},
	{
		score: 47,
		songID: 746,
		userID: 18,
		playDate: new Date('2023-07-18 17:45:56'),
		difficulties: 5,
	},
	{
		score: 80,
		songID: 791,
		userID: 18,
		playDate: new Date('2023-08-21 1:19:45'),
		difficulties: 1,
	},
	{
		score: 21,
		songID: 748,
		userID: 18,
		playDate: new Date('2023-07-04 9:09:27'),
		difficulties: 4,
	},
	{
		score: 75,
		songID: 541,
		userID: 18,
		playDate: new Date('2023-09-19 23:08:05'),
		difficulties: 2,
	},
	{
		score: 31,
		songID: 724,
		userID: 18,
		playDate: new Date('2023-07-09 2:01:29'),
		difficulties: 4,
	},
	{
		score: 24,
		songID: 654,
		userID: 18,
		playDate: new Date('2023-09-04 1:27:00'),
		difficulties: 1,
	},
	{
		score: 55,
		songID: 154,
		userID: 18,
		playDate: new Date('2023-07-10 17:48:17'),
		difficulties: 3,
	},
	{
		score: 4,
		songID: 645,
		userID: 18,
		playDate: new Date('2023-09-11 18:51:11'),
		difficulties: 2,
	},
	{
		score: 52,
		songID: 457,
		userID: 18,
		playDate: new Date('2023-07-30 19:12:52'),
		difficulties: 3,
	},
	{
		score: 68,
		songID: 236,
		userID: 18,
		playDate: new Date('2023-08-08 8:56:08'),
		difficulties: 3,
	},
	{
		score: 44,
		songID: 16,
		userID: 18,
		playDate: new Date('2023-07-22 10:39:34'),
		difficulties: 1,
	},
	{
		score: 59,
		songID: 863,
		userID: 18,
		playDate: new Date('2023-09-17 4:12:43'),
		difficulties: 1,
	},
	{
		score: 18,
		songID: 276,
		userID: 18,
		playDate: new Date('2023-07-08 15:47:54'),
		difficulties: 2,
	},
	{
		score: 64,
		songID: 557,
		userID: 18,
		playDate: new Date('2023-08-17 0:13:46'),
		difficulties: 1,
	},
	{
		score: 2,
		songID: 452,
		userID: 18,
		playDate: new Date('2023-07-26 5:13:31'),
		difficulties: 5,
	},
	{
		score: 99,
		songID: 546,
		userID: 18,
		playDate: new Date('2023-07-11 16:31:37'),
		difficulties: 1,
	},
	{
		score: 75,
		songID: 598,
		userID: 18,
		playDate: new Date('2023-08-12 22:56:24'),
		difficulties: 4,
	},
	{
		score: 4,
		songID: 258,
		userID: 18,
		playDate: new Date('2023-09-20 8:26:50'),
		difficulties: 2,
	},
	{
		score: 50,
		songID: 190,
		userID: 18,
		playDate: new Date('2023-09-20 20:07:06'),
		difficulties: 4,
	},
	{
		score: 9,
		songID: 914,
		userID: 18,
		playDate: new Date('2023-08-30 16:57:14'),
		difficulties: 5,
	},
	{
		score: 7,
		songID: 92,
		userID: 18,
		playDate: new Date('2023-07-18 20:33:44'),
		difficulties: 5,
	},
	{
		score: 94,
		songID: 98,
		userID: 18,
		playDate: new Date('2023-08-15 5:05:18'),
		difficulties: 5,
	},
	{
		score: 94,
		songID: 424,
		userID: 18,
		playDate: new Date('2023-07-22 9:59:12'),
		difficulties: 5,
	},
	{
		score: 14,
		songID: 635,
		userID: 18,
		playDate: new Date('2023-07-02 6:58:39'),
		difficulties: 4,
	},
	{
		score: 99,
		songID: 893,
		userID: 18,
		playDate: new Date('2023-08-05 16:09:33'),
		difficulties: 1,
	},
	{
		score: 94,
		songID: 67,
		userID: 18,
		playDate: new Date('2023-07-01 8:11:37'),
		difficulties: 2,
	},
	{
		score: 21,
		songID: 335,
		userID: 18,
		playDate: new Date('2023-08-03 2:07:44'),
		difficulties: 3,
	},
	{
		score: 47,
		songID: 294,
		userID: 18,
		playDate: new Date('2023-09-13 17:32:46'),
		difficulties: 4,
	},
	{
		score: 89,
		songID: 184,
		userID: 18,
		playDate: new Date('2023-07-04 5:20:13'),
		difficulties: 2,
	},
	{
		score: 28,
		songID: 345,
		userID: 18,
		playDate: new Date('2023-09-07 6:35:11'),
		difficulties: 3,
	},
	{
		score: 93,
		songID: 697,
		userID: 18,
		playDate: new Date('2023-07-29 0:07:10'),
		difficulties: 2,
	},
	{
		score: 58,
		songID: 666,
		userID: 18,
		playDate: new Date('2023-07-09 3:03:02'),
		difficulties: 2,
	},
	{
		score: 73,
		songID: 459,
		userID: 18,
		playDate: new Date('2023-08-05 7:33:54'),
		difficulties: 4,
	},
	{
		score: 50,
		songID: 695,
		userID: 18,
		playDate: new Date('2023-07-26 18:26:55'),
		difficulties: 4,
	},
	{
		score: 39,
		songID: 995,
		userID: 18,
		playDate: new Date('2023-08-24 17:34:09'),
		difficulties: 3,
	},
	{
		score: 25,
		songID: 122,
		userID: 18,
		playDate: new Date('2023-08-25 18:54:12'),
		difficulties: 1,
	},
	{
		score: 29,
		songID: 439,
		userID: 18,
		playDate: new Date('2023-09-15 0:44:48'),
		difficulties: 3,
	},
	{
		score: 79,
		songID: 234,
		userID: 18,
		playDate: new Date('2023-09-13 13:53:16'),
		difficulties: 2,
	},
	{
		score: 0,
		songID: 369,
		userID: 18,
		playDate: new Date('2023-08-30 22:54:34'),
		difficulties: 1,
	},
	{
		score: 25,
		songID: 223,
		userID: 18,
		playDate: new Date('2023-09-13 1:09:11'),
		difficulties: 3,
	},
	{
		score: 55,
		songID: 716,
		userID: 18,
		playDate: new Date('2023-07-12 19:43:23'),
		difficulties: 3,
	},
	{
		score: 100,
		songID: 62,
		userID: 18,
		playDate: new Date('2023-07-11 15:33:40'),
		difficulties: 5,
	},
	{
		score: 74,
		songID: 271,
		userID: 18,
		playDate: new Date('2023-08-25 23:14:51'),
		difficulties: 3,
	},
	{
		score: 22,
		songID: 265,
		userID: 18,
		playDate: new Date('2023-07-17 15:01:38'),
		difficulties: 1,
	},
	{
		score: 79,
		songID: 552,
		userID: 18,
		playDate: new Date('2023-07-28 20:13:14'),
		difficulties: 5,
	},
	{
		score: 50,
		songID: 603,
		userID: 18,
		playDate: new Date('2023-07-06 3:52:21'),
		difficulties: 5,
	},
];

function xpToLevel(xp: number): number {
	return Math.floor(xp / 1000);
}

function xpToProgressBarValue(xp: number): number {
	return Math.floor(xp / 10);
}

const ProfileView = (props: RouteProps<{}>) => {
	const layout = useWindowDimensions();
	const navigation = useNavigation();
	const userQuery = useQuery(API.getUserInfo);
	// const scoresQuery = useQuery(API.getSongHistory(props.songId), { refetchOnWindowFocus: true });

	if (!userQuery.data) {
		return <LoadingView />;
	}

	// const user = userQuery.data;
	const progessValue = xpToProgressBarValue(userQuery.data.data.xp);
	const level = xpToLevel(userQuery.data.data.xp);

	return (
		<ScaffoldCC routeName={props.route.name}>
			<Flex>
				<Wrap
					style={{
						flexDirection: layout.width > 650 ? 'row' : 'column',
						alignItems: 'center',
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
								paddingBottom: 20,
								justifyContent: 'space-between',
							}}
						>
							<Text fontSize={'xl'} style={{ paddingRight: 'auto' }}>
								{userQuery.data.name}
							</Text>
							<ButtonBase
								title="Modifier profil"
								style={{ width: 'fit-content' }}
								type={'filled'}
								onPress={async () => navigation.navigate('Settings')}
							/>
						</Wrap>
						<Text style={{ paddingBottom: 10, fontWeight: 'bold' }}>
							Account created on {userQuery.data.data.createdAt.toLocaleDateString()}
						</Text>
						<Wrap style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10 }}>
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
						bgColor={'#rgba(16,16,20,0.5)'}
						value={progessValue}
						w={'2/3'}
						maxW={'400'}
					/>
				</Row>
				<ScoreGraph
					songHistory={{
						history: fakeData,
						best: 200,
					}}
				/>
			</Flex>
		</ScaffoldCC>
	);
};

export default ProfileView;
