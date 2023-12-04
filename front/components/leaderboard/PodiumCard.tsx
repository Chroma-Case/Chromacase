import { Text, Avatar } from "native-base";
import { MedalStar } from 'iconsax-react-native';
import { View } from "react-native";
import { getInitials } from "../UserAvatar";

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
				<Avatar
					size="2xl"
					source={{
						uri: userAvatarUrl,
					}}
					style={{
						width: '100%',
						height: '100%',
						borderRadius: 12,
					}}
				>
					{userPseudo ? getInitials(userPseudo) : '---'}
				</Avatar>
				<MedalStar
					style={{ position: 'absolute', bottom: 0, right: 0 }}
					size="42"
					variant="Bold"
					color={medalColor}
				/>
			</View>
			<Text
				mt={4}
				style={{
					fontSize: 20,
					fontWeight: '500',
				}}
			>
				{userPseudo}
			</Text>
			<Text
				mt={1}
				style={{
					fontSize: 24,
					fontWeight: '500',
				}}
			>
				{userLvl ?? '-'}
			</Text>
		</View>
	);
};
