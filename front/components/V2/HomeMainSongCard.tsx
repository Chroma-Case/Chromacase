import { Image, View } from 'react-native';
import { Text, Pressable, PresenceTransition } from 'native-base';

type HomeMainSongCardProps = {
	image: string;
	title: string;
	artist: string;
	fontSize: number;
	onPress: () => void;
};

const HomeMainSongCard = (props: HomeMainSongCardProps) => {
	// on hover darken the image and show the title and artist with fade in
	return (
		<Pressable onPress={props.onPress}>
			{({ isHovered }) => (
				<View
					style={{
						width: '100%',
						height: '100%',
						borderRadius: 12,
						overflow: 'hidden',
						position: 'relative',
					}}
				>
					<Image
						source={{
							uri: props.image,
						}}
						style={{
							aspectRatio: 1,
							width: '100%',
							height: '100%',
							flexShrink: 1,
						}}
					/>
					<PresenceTransition
						style={{
							width: '100%',
							height: '100%',
							position: 'absolute',
						}}
						visible={isHovered}
						initial={{
							opacity: 0,
						}}
						animate={{
							opacity: 1,
						}}
					>
						<View
							style={{
								width: '100%',
								height: '100%',
								backgroundColor: 'rgba(0, 0, 0, 0.75)',
								justifyContent: 'flex-end',
								alignItems: 'flex-start',
								paddingHorizontal: 16,
								paddingVertical: 36,
							}}
						>
							<Text
								style={{
									color: 'white',
									fontSize: props.fontSize,
									fontWeight: 'bold',
								}}
								selectable={false}
							>
								{props.title}
							</Text>
							<Text
								style={{
									color: 'white',
									fontSize: props.fontSize * 0.4,
									fontWeight: 'bold',
									textAlign: 'center',
								}}
								selectable={false}
							>
								{props.artist}
							</Text>
						</View>
					</PresenceTransition>
				</View>
			)}
		</Pressable>
	);
};

HomeMainSongCard.defaultProps = {
	onPress: () => {},
	fontSize: 16,
};

export default HomeMainSongCard;
