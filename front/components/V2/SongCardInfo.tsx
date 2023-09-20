import Song from '../../models/Song';
import React from 'react';
import { Image, View } from 'react-native';
import { Pressable, Text, PresenceTransition, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

type SongCardInfoProps = {
	song: Song;
	onPress: () => void;
	onPlay: () => void;
};

const CardDims = {
	height: 200,
	width: 200,
};

const Scores = [
	{
		icon: 'warning',
		score: 3,
	},
	{
		icon: 'star',
		score: -225,
	},
	{
		icon: 'trophy',
		score: 100,
	},
];

const SongCardInfo = (props: SongCardInfoProps) => {
	const [isPlayHovered, setIsPlayHovered] = React.useState(false);
	const [isHovered, setIsHovered] = React.useState(false);
	const [isSlided, setIsSlided] = React.useState(false);

	return (
		<View
			style={{
				width: CardDims.width,
				height: CardDims.height,
				// @ts-expect-error boxShadow isn't yet supported by react native
				boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)',
				backDropFilter: 'blur(2px)',
				backgroundColor: 'rgba(16, 16, 20, 0.70)',
				borderRadius: 12,
				overflow: 'hidden',
			}}
		>
			<Pressable
				delayHoverIn={7}
				isHovered={isPlayHovered ? true : undefined}
				onPress={props.onPress}
				style={{
					width: '100%',
				}}
				onHoverIn={() => {
					setIsHovered(true);
				}}
				onHoverOut={() => {
					setIsHovered(false);
					setIsSlided(false);
				}}
			>
				<>
					<View
						style={{
							width: CardDims.width,
							height: CardDims.height,
							backgroundColor: 'rgba(16, 16, 20, 0.7)',
							borderRadius: 12,
							display: 'flex',
							justifyContent: 'flex-end',
							alignItems: 'center',
						}}
					>
						<View
							style={{
								width: '100%',
								marginBottom: 8,
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							{Scores.map((score, idx) => (
								<View
									key={score.icon + idx}
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										// @ts-expect-error gap isn't yet supported by react native
										gap: 5,
										paddingHorizontal: 10,
									}}
								>
									<Icon as={Ionicons} name={score.icon} size={17} color="white" />
									<Text
										style={{
											color: 'white',
											fontSize: 12,
											fontWeight: 'bold',
										}}
									>
										{score.score}
									</Text>
								</View>
							))}
						</View>
					</View>
					<PresenceTransition
						style={{
							width: '100%',
							height: '100%',
							position: 'absolute',
						}}
						visible={isHovered}
						initial={{
							translateY: 0,
						}}
						animate={{
							translateY: -55,
						}}
						onTransitionComplete={() => {
							if (isHovered) {
								setIsSlided(true);
							}
						}}
					>
						<Image
							source={{ uri: props.song.cover }}
							style={{
								position: 'relative',
								width: CardDims.width,
								height: CardDims.height,
								borderRadius: 12,
							}}
						/>
						<View
							style={{
								position: 'absolute',
								width: '100%',
								height: '100%',
								backgroundColor: 'rgba(0, 0, 0, 0.75)',
								justifyContent: 'flex-end',
								alignItems: 'flex-start',
								paddingHorizontal: 10,
								paddingVertical: 7,
								borderRadius: 12,
							}}
						>
							<View
								style={{
									width: '100%',
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'flex-end',
									justifyContent: 'space-between',
								}}
							>
								<View
									style={{
										flexShrink: 1,
									}}
								>
									<Text
										numberOfLines={2}
										style={{
											color: 'white',
											fontSize: 14,
											fontWeight: 'bold',
											marginBottom: 4,
										}}
									>
										{props.song.name}
									</Text>
									<Text
										numberOfLines={1}
										style={{
											color: 'white',
											fontSize: 12,
											fontWeight: 'normal',
										}}
									>
										{props.song.artistId}
									</Text>
								</View>
								<Ionicons
									style={{
										flexShrink: 0,
									}}
									name="bookmark-outline"
									size={17}
									color="#6075F9"
								/>
							</View>
						</View>
					</PresenceTransition>
					<PresenceTransition
						style={{
							width: '100%',
							height: '100%',
							position: 'absolute',
						}}
						visible={isSlided}
						initial={{
							opacity: 0,
						}}
						animate={{
							opacity: 1,
						}}
					>
						<View
							style={{
								position: 'absolute',
								width: '100%',
								height: '100%',
								display: 'flex',
								justifyContent: 'flex-end',
								alignItems: 'center',
							}}
						>
							<Pressable
								onHoverIn={() => {
									setIsPlayHovered(true);
								}}
								onHoverOut={() => {
									setIsPlayHovered(false);
								}}
								borderRadius={100}
								marginBottom={35}
								onPress={props.onPlay}
							>
								{({ isPressed, isHovered }) => (
									<View
										style={{
											width: 40,
											height: 40,
											borderRadius: 100,
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											backgroundColor: (() => {
												if (isPressed) {
													return 'rgba(96, 117, 249, 1)';
												} else if (isHovered) {
													return 'rgba(96, 117, 249, 0.9)';
												} else {
													return 'rgba(96, 117, 249, 0.7)';
												}
											})(),
										}}
									>
										<Ionicons
											name="play-outline"
											color={'white'}
											size={20}
											rounded="sm"
										/>
									</View>
								)}
							</Pressable>
						</View>
					</PresenceTransition>
				</>
			</Pressable>
		</View>
	);
};

SongCardInfo.defaultProps = {
	onPress: () => {},
	onPlay: () => {},
};

export default SongCardInfo;
