import { View } from 'react-native';
import { Avatar, Text, useTheme } from 'native-base';
import { getInitials } from '../UserAvatar';

type BoardRowProps = {
	userAvatarUrl: string;
	userPseudo: string;
	userLvl: number;
	index: number;
};

export const BoardRow = ({ userAvatarUrl, userPseudo, userLvl, index }: BoardRowProps) => {
	const { colors } = useTheme();
	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				alignSelf: 'stretch',
				borderRadius: 8,
				overflow: 'hidden',
				backgroundColor: colors.coolGray[500],
				shadowColor: 'rgba(0, 0, 0, 0.25)',
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 1,
				shadowRadius: 4,
				height: 50,
			}}
		>
			<View
				style={{
					height: '100%',
					aspectRatio: 1,
				}}
			>
				<Avatar
                    bg={colors.coolGray[900]}
					source={{
						uri: userAvatarUrl,
					}}
					style={{
						flex: 1,
						borderRadius: 0,
					}}
					_image={{
						borderRadius: 0,
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
					flexShrink: 0,
					flexGrow: 0,
					fontSize: 16,
					fontStyle: 'normal',
					fontWeight: '500',
					marginHorizontal: 10,
				}}
			>
				{userLvl}
			</Text>
			<View
				style={{
					backgroundColor: 'rgba(255, 255, 255, 0.50)',
					aspectRatio: 1,
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
					{index}
				</Text>
			</View>
		</View>
	);
};
