import { Text, Avatar, useTheme } from 'native-base';
import { MedalStar } from 'iconsax-react-native';
import { View } from 'react-native';
import { getInitials } from '../UserAvatar';

type PodiumCardProps = {
	offset: number;
	medalColor: string;
	userAvatarUrl?: string;
	// pseudo and lvl are optional because only when
	// we don't have the data for the 3rd place
	userPseudo?: string;
	userLvl?: number;
};

export const PodiumCard = ({
	offset,
	medalColor,
	userAvatarUrl,
	userPseudo,
	userLvl,
}: PodiumCardProps) => {
	const { colors } = useTheme();
	return (
		<View
			style={{
				display: 'flex',
				paddingTop: offset,
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				width: 140,
				gap: 5,
			}}
		>
			<View
				style={{
					width: 140,
					height: 140,
				}}
			>
				<Avatar
					size="2xl"
					bg={colors.coolGray[900]}
					source={{
						uri: userAvatarUrl,
					}}
					style={{
						width: '100%',
						height: '100%',
						borderRadius: 12,
						overflow: 'hidden',
					}}
					_image={{
						borderRadius: 0,
					}}
				>
					{userPseudo ? getInitials(userPseudo) : '---'}
					<Avatar.Badge bg="coolGray.900">
						<MedalStar size="24" variant="Bold" color={medalColor} />
					</Avatar.Badge>
				</Avatar>
			</View>
			<View>
				<Text fontSize={20} numberOfLines={2} isTruncated>
					{userPseudo ?? '---'}
				</Text>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 5,
					}}
				>
					<Text fontSize={24} fontWeight={'bold'}>
						{userLvl ?? '-'}
					</Text>
					<MedalStar size="24" variant="Bold" color={medalColor} />
				</View>
			</View>
		</View>
	);
};
