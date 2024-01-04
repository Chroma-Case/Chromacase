import { Platform, View } from 'react-native';
import { IconButton } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

type LikeButtonProps = {
	isLiked: boolean;
	onPress?: () => void;
	color?: string;
};

export const LikeButton = ({ isLiked, color, onPress }: LikeButtonProps) => {
	if (Platform.OS === 'web') {
		// painful error of no onHover event control
		return (
			<View onClick={onPress}>
				<MaterialIcons
					color={color}
					name={isLiked ? 'favorite' : 'favorite-outline'}
					size={17}
				/>
			</View>
		);
	}
	return (
		<IconButton
			variant={'ghost'}
			borderRadius={'full'}
			size={17}
			color={color}
			onPress={onPress}
			_icon={{
				as: MaterialIcons,
				name: isLiked ? 'favorite' : 'favorite-outline',
			}}
		/>
	);
};
