import { Box, Heading, useBreakpointValue, ScrollView, Text } from 'native-base';
import { View, Image } from 'react-native';
import { useQuery } from '../Queries';
import API from '../API';
import { Ionicons } from '@expo/vector-icons';
import User from '../models/User';

type PodiumCardProps = {
	offset: number;
	medalColor: string;
	userAvatarUrl: string;
	userPseudo: string;
	userXp: number;
};

const PodiumCardComponent = ({ offset, medalColor, userAvatarUrl, userPseudo, userXp }: PodiumCardProps) => {
	return (
		<View
			style={{
				display: 'flex',
				paddingTop: 0 + offset,
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
				<Ionicons
					style={{ position: 'absolute', top: 106, left: 106 }}
					name="medal"
					size={24}
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
				{userXp} LVL
			</Text>
		</View>
	);
};

type BoardRowProps = {
	userPseudo: string;
	userXp: number;
}

const BoardRowComponent = () => {
	return (
		<View
			style={{
				margin: 5,
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
						uri: 'https://picsum.photos/50/50',
					}}
					style={{ width: '100%', height: '100%' }}
				/>
			</View>

			<Text
				style={{
					fontSize: 16,
					fontStyle: 'normal',
					flex: '1 1 0',
					marginHorizontal: 10,
					fontWeight: '500',
				}}
			>
				Momo est boutain
			</Text>
			<Text
				style={{
					fontSize: 16,
					fontStyle: 'normal',
					fontWeight: '500',
					marginHorizontal: 10,
				}}
			>
				200 LVL
			</Text>
			<View
				style={{
					backgroundColor: 'rgba(255, 255, 255, 0.50)',
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
					8
				</Text>
			</View>
		</View>
	);
};

const dummyScores = [
	{
		id: 1,
	},
	{
		id: 2,
	},
	{
		id: 3,
	},
	{
		id: 4,
	},
	{
		id: 5,
	},
	{
		id: 6,
	},
	{
		id: 7,
	},
	{
		id: 8,
	},
	{
		id: 9,
	},
];

const Leaderboardiew = () => {
	const scoresQuery = useQuery(API.getTopTwentyPlayers);

	return (
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
				<View /** podium view */
					style={{
						display: 'flex',
						paddingBottom: 0,
						justifyContent: 'center',
						alignItems: 'center',
						alignSelf: 'stretch',
						flexDirection: 'row',
						marginBottom: 20,
					}}
				>
					<PodiumCardComponent
						medalColor="#AE84FB"
						offset={80}
						userAvatarUrl={scoresQuery.data?.at(2)?.data.avatar ?? "fake image"}
						userPseudo={scoresQuery.data?.at(2)?.name ?? "Momo"}
						userXp={scoresQuery.data?.at(2)?.data.xp ?? 0}
					/>
					<PodiumCardComponent
						medalColor="#EAD93C"
						offset={0}
						userAvatarUrl={scoresQuery.data?.at(0)?.data.avatar ?? "fake image"}
						userPseudo={scoresQuery.data?.at(0)?.name ?? "Momo"}
						userXp={scoresQuery.data?.at(0)?.data.xp ?? 0}
					/>
					<PodiumCardComponent
						medalColor="#5F74F7"
						offset={60}
						userAvatarUrl={scoresQuery.data?.at(1)?.data.avatar ?? "fake image"}
						userPseudo={scoresQuery.data?.at(1)?.name ?? "Momo"}
						userXp={scoresQuery.data?.at(1)?.data.xp ?? 0}
					/>
				</View>
				{dummyScores.map((comp, index) => (
					<BoardRowComponent />
				))}
			</View>
		</ScrollView>
	);
};

export default Leaderboardiew;
