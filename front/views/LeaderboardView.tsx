import { useBreakpointValue, ScrollView, Text } from 'native-base';
import { View, Image } from 'react-native';
import { useQuery } from '../Queries';
import API from '../API';
import { LoadingView } from '../components/Loading';
import { useNavigation, RouteProps } from '../Navigation';
import { MedalStar } from 'iconsax-react-native';
import ScaffoldCC from '../components/UI/ScaffoldCC';

type PodiumCardProps = {
	offset: number;
	medalColor: string;
	userAvatarUrl: string;
	userPseudo: string;
	userLvl: number;
};

const PodiumCardComponent = ({
	offset,
	medalColor,
	userAvatarUrl,
	userPseudo,
	userLvl,
}: PodiumCardProps) => {
	return (
		<View
			style={{
				display: 'flex',
				paddingTop: offset,
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				marginLeft: 32,
			}}
		>
			<View /** image + medal container*/
				style={{
					width: 140,
					height: 140,
				}}
			>
				<Image
					source={{
						uri: userAvatarUrl,
					}}
					style={{
						aspectRatio: 1,
						width: '100%',
						height: '100%',
						flexShrink: 0,
						borderRadius: 12,
					}}
				/>
				<MedalStar
					style={{ position: 'absolute', top: 115, left: 115 }}
					size="42"
					variant="Bold"
					color={medalColor}
				/>
			</View>
			<Text
				mt={4}
				style={{
					fontSize: 16,
					fontStyle: 'normal',
					fontWeight: '500',
				}}
			>
				{userPseudo}
			</Text>
			<Text
				mt={1}
				style={{
					fontSize: 16,
					fontStyle: 'normal',
					fontWeight: '500',
				}}
			>
				{userLvl} LVL
			</Text>
		</View>
	);
};

type BoardRowProps = {
	userAvatarUrl: string;
	userPseudo: string;
	userLvl: number;
	index: number;
};

const BoardRowComponent = ({ userAvatarUrl, userPseudo, userLvl, index }: BoardRowProps) => {
	return (
		<View
			style={{
				marginVertical: 5,
				marginHorizontal: 10,
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				alignSelf: 'stretch',
				borderRadius: 8,
				backgroundColor: 'rgba(16, 16, 20, 0.50)',
				shadowColor: 'rgba(0, 0, 0, 0.25)',
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 1,
				shadowRadius: 4,
				marginTop: 10,
			}}
		>
			<View
				style={{
					width: 50,
					height: 50,
				}}
			>
				<Image
					source={{
						uri: userAvatarUrl,
					}}
					style={{
						width: '100%',
						height: '100%',
						borderTopLeftRadius: 8,
						borderBottomLeftRadius: 8,
					}}
				/>
			</View>

			<Text
				style={{
					fontSize: 16,
					fontStyle: 'normal',
					flex: 1,
					marginHorizontal: 10,
					fontWeight: '500',
				}}
			>
				{userPseudo}
			</Text>
			<Text
				style={{
					fontSize: 16,
					fontStyle: 'normal',
					fontWeight: '500',
					marginHorizontal: 10,
				}}
			>
				{userLvl} LVL
			</Text>
			<View
				style={{
					backgroundColor: 'rgba(255, 255, 255, 0.50)',
					// borderRadius: 8,
					borderTopRightRadius: 8,
					borderBottomRightRadius: 8,
					width: 50,
					height: '100%',
					flexDirection: 'column',
					justifyContent: 'center',
				}}
			>
				<Text
					style={{
						fontSize: 16,
						fontStyle: 'normal',
						fontWeight: '500',
						textAlign: 'center',
					}}
				>
					{index + 4}
				</Text>
			</View>
		</View>
	);
};

const Leaderboardiew = (props: RouteProps<{}>) => {
	const navigation = useNavigation();
	const scoresQuery = useQuery(API.getTopTwentyPlayers());
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isPhone = screenSize === 'small';

	if (scoresQuery.isError) {
		navigation.navigate('Error');
		return <></>;
	}
	if (scoresQuery.data === undefined) {
		return (
			<ScaffoldCC routeName={props.route.name}>
				<LoadingView />
			</ScaffoldCC>
		);
	}

	return (
		<ScaffoldCC routeName={props.route.name}>
			<ScrollView style={{ marginBottom: 5 }}>
				<View
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'flex-start',
						flex: 1,
						flexGrow: 1,
						flexShrink: 0,
						flexBasis: 0,
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
								paddingBottom: 10,
								marginBottom: 20,
							}}
						>
							<PodiumCardComponent
								medalColor="#AE84FB"
								offset={80}
								userAvatarUrl={
									scoresQuery.data?.at(2)?.data.avatar ??
									'https://picsum.photos/140/140'
								}
								userPseudo={scoresQuery.data?.at(2)?.name ?? '---'}
								userLvl={scoresQuery.data?.at(2)?.data.totalScore ?? 42}
							/>
							<PodiumCardComponent
								medalColor="#EAD93C"
								offset={0}
								userAvatarUrl={
									scoresQuery.data?.at(0)?.data.avatar ??
									'https://picsum.photos/140/140'
								}
								userPseudo={scoresQuery.data?.at(0)?.name ?? '---'}
								userLvl={scoresQuery.data?.at(0)?.data.totalScore ?? 42}
							/>
							<PodiumCardComponent
								medalColor="#5F74F7"
								offset={60}
								userAvatarUrl={
									scoresQuery.data?.at(1)?.data.avatar ??
									'https://picsum.photos/140/140'
								}
								userPseudo={scoresQuery.data?.at(1)?.name ?? '---'}
								userLvl={scoresQuery.data?.at(1)?.data.totalScore ?? 42}
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
							<PodiumCardComponent
								medalColor="#AE84FB"
								offset={80}
								userAvatarUrl={
									scoresQuery.data?.at(0)?.data.avatar ??
									'https://picsum.photos/140/140'
								}
								userPseudo={scoresQuery.data?.at(0)?.name ?? '---'}
								userLvl={scoresQuery.data?.at(0)?.data.totalScore ?? 42}
							/>
							<View
								style={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<PodiumCardComponent
									medalColor="#EAD93C"
									offset={0}
									userAvatarUrl={
										scoresQuery.data?.at(1)?.data.avatar ??
										'https://picsum.photos/140/140'
									}
									userPseudo={scoresQuery.data?.at(1)?.name ?? '---'}
									userLvl={scoresQuery.data?.at(1)?.data.totalScore ?? 42}
								/>
								<PodiumCardComponent
									medalColor="#5F74F7"
									offset={60}
									userAvatarUrl={
										scoresQuery.data?.at(2)?.data.avatar ??
										'https://picsum.photos/140/140'
									}
									userPseudo={scoresQuery.data?.at(2)?.name ?? '---'}
									userLvl={scoresQuery.data?.at(2)?.data.totalScore ?? 42}
								/>
							</View>
						</View>
					)}
					{scoresQuery.data.slice(3).map((comp: any, index: number) => (
						<BoardRowComponent
							index={index}
							userAvatarUrl={comp?.avatar ?? 'https://picsum.photos/50/50'}
							userLvl={comp?.data.totalScore ?? 42}
							userPseudo={comp?.name ?? '---'}
						/>
					))}
				</View>
			</ScrollView>
		</ScaffoldCC>
	);
};

export default Leaderboardiew;
