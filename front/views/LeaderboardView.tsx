import { Box, Heading, useBreakpointValue, ScrollView, Text } from 'native-base';
import { View, Image } from 'react-native';
import { useQuery } from 'react-query';
import User from '../models/User';
import API from '../API';

const PodiumUserCardComponent = () => {
	return (
		<View
			style={{
				display: 'flex',
				paddingTop: 60,
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>

			<View
				style={{
					width: 140,
					height: 140,
					flexShrink: 0,
					borderRadius: 12,
				}}
			>
				<Image 
					source={{
						uri: 'https://picsum.photos/140/140',
					}}
					style={{
						aspectRatio: 1,
						width: '100%',
						height: '100%',
						flexShrink: 1,
					}}
				/>
				<Text
					style={{
						color: '#FFF',
						fontFamily: 'Lexend',
						fontSize: 16,
						fontStyle: 'normal',
						fontWeight: '500',
					}}
				>

				</Text>
			</View>
		</View>
	);
}

const boardRowComponent = () => {
	return (
		<View>

		</View>
	);
}

const Leaderboardiew = () => {st 
	con
	return (
		<View
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<View
				style={{
					display: 'flex',
					paddingBottom: 0,
					justifyContent: 'center',
					alignItems: 'center',
					alignSelf: 'stretch',
				}}
			>
			</View>
		</View>
	);
}

export default Leaderboardiew;