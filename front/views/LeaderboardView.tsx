import { useBreakpointValue, ScrollView, Text } from 'native-base';
import { View } from 'react-native';
import { useQuery } from '../Queries';
import API from '../API';
import { LoadingView } from '../components/Loading';
import { useNavigation, RouteProps } from '../Navigation';
import ScaffoldCC from '../components/UI/ScaffoldCC';
import { translate } from '../i18n/i18n';
import { PodiumCard } from '../components/leaderboard/PodiumCard';
import { BoardRow } from '../components/leaderboard/BoardRow';

const Leaderboardiew = (props: RouteProps<Record<string, never>>) => {
	const navigation = useNavigation();
	const scoresQuery = useQuery(API.getTopTwentyPlayers());
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isPhone = screenSize === 'small';

	if (scoresQuery.isError) {
		navigation.navigate('Error');
		return <></>;
	}
	if (!scoresQuery.data) {
		return (
			<ScaffoldCC routeName={props.route.name}>
				<LoadingView />
			</ScaffoldCC>
		);
	}

	const podiumUserData = [
		scoresQuery.data.at(0),
		scoresQuery.data.at(1),
		scoresQuery.data.at(2),
	] as const;

	return (
		<ScaffoldCC routeName={props.route.name}>
			<ScrollView>
				<Text
					style={{
						fontSize: 20,
						fontWeight: '500',
						marginBottom: 16,
					}}
				>
					{translate('leaderBoardHeading')}
				</Text>
				<Text
					style={{
						fontSize: 14,
						fontWeight: '500',
					}}
				>
					{translate('leaderBoardHeadingFull')}
				</Text>
				<View
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'flex-start',
						paddingTop: 20,
						flex: 1,
						alignSelf: 'stretch',
					}}
				>
					{!isPhone ? (
						<View /** podium view */
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
								alignSelf: 'stretch',
								gap: 32,
								paddingBottom: 10,
								marginBottom: 20,
							}}
						>
							<PodiumCard
								medalColor="#AE84FB"
								offset={120}
								userAvatarUrl={podiumUserData[2]?.data.avatar}
								userPseudo={podiumUserData[2]?.name}
								userLvl={podiumUserData[2]?.data.totalScore}
							/>
							<PodiumCard
								medalColor="#EAD93C"
								offset={0}
								userAvatarUrl={podiumUserData[0]?.data.avatar}
								userPseudo={podiumUserData[0]?.name}
								userLvl={podiumUserData[0]?.data.totalScore}
							/>
							<PodiumCard
								medalColor="#5F74F7"
								offset={60}
								userAvatarUrl={podiumUserData[1]?.data.avatar}
								userPseudo={podiumUserData[1]?.name}
								userLvl={podiumUserData[1]?.data.totalScore}
							/>
						</View>
					) : (
						<View
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								alignSelf: 'stretch',
							}}
						>
							<PodiumCard
								medalColor="#EAD93C"
								offset={0}
								userAvatarUrl={podiumUserData[0]?.data.avatar}
								userPseudo={podiumUserData[0]?.name}
								userLvl={podiumUserData[0]?.data.totalScore}
							/>
							<View
								style={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									gap: 64,
								}}
							>
								<PodiumCard
									medalColor="#5F74F7"
									offset={0}
									userAvatarUrl={podiumUserData[1]?.data.avatar}
									userPseudo={podiumUserData[1]?.name}
									userLvl={podiumUserData[1]?.data.totalScore}
								/>
								<PodiumCard
									medalColor="#AE84FB"
									offset={60}
									userAvatarUrl={podiumUserData[2]?.data.avatar}
									userPseudo={podiumUserData[2]?.name}
									userLvl={podiumUserData[2]?.data.totalScore}
								/>
							</View>
						</View>
					)}
					<View
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							alignSelf: 'stretch',
							gap: 15,
							paddingRight: 10,
						}}
					>
						{scoresQuery.data.slice(3, 20).map((comp, index) => (
							<BoardRow
								key={comp.name + index}
								index={index + 4}
								userAvatarUrl={comp.data.avatar}
								userLvl={comp.data.totalScore}
								userPseudo={comp.name}
							/>
						))}
					</View>
				</View>
			</ScrollView>
		</ScaffoldCC>
	);
};

export default Leaderboardiew;
