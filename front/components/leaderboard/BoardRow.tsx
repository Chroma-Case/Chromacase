import { View } from 'react-native';
import { Avatar, Text } from 'native-base';
import { getInitials } from '../UserAvatar';

type BoardRowProps = {
	userAvatarUrl: string;
	userPseudo: string;
	userLvl: number;
	index: number;
};

export const BoardRow = ({ userAvatarUrl, userPseudo, userLvl, index }: BoardRowProps) => {
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
				<Avatar
					source={{
						uri: userAvatarUrl,
					}}
					style={{
						width: '100%',
						height: '100%',
						borderTopLeftRadius: 8,
						borderBottomLeftRadius: 8,
					}}
				>
					{getInitials(userPseudo)}
				</Avatar>
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
