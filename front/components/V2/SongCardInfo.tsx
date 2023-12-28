import Song from '../../models/Song';
import React from 'react';
import { LikeButton } from './SongCardInfoLikeBtn';
import { Image, Platform, View } from 'react-native';
import {
	Pressable,
	Text,
	PresenceTransition,
	Icon,
	useBreakpointValue,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '../../Queries';
import API from '../../API';
import { useLikeSongMutation } from '../../utils/likeSongMutation';
import Hoverable from '../Hoverable';

type SongCardInfoProps = {
	song: Song;
	onPress: () => void;
	onPlay: () => void;
};

const SongCardInfo = (props: SongCardInfoProps) => {
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isPhone = screenSize === 'small';
	const [isPlayHovered, setIsPlayHovered] = React.useState(false);
	const [isHovered, setIsHovered] = React.useState(false);
	const [isSlided, setIsSlided] = React.useState(false);
	const user = useQuery(API.getUserInfo);
	const [isLiked, setIsLiked] = React.useState(false);
	const { mutate } = useLikeSongMutation();

	const CardDims = {
		height: isPhone ? 160 : 200,
		width: isPhone ? 160 : 200,
	};

	const Scores = [
		{
			icon: 'time',
			score: props.song.lastScore ?? '-',
		},
		{
			icon: 'trophy',
			score: props.song.bestScore ?? '-',
		},
	];

	React.useEffect(() => {
		if (!user.data) {
			return;
		}
		setIsLiked(
			props.song.likedByUsers?.some(({ userId }) => userId === user.data?.id) ?? false
		);
	}, [user.data, props.song.likedByUsers]);

	return (
		<Pressable
			delayHoverIn={7}
			onPress={Platform.OS === 'android' ? props.onPress : undefined}
			style={{
				width: CardDims.width,
				height: CardDims.height,
				// @ts-expect-error boxShadow isn't yet supported by react native
				boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)',
				backDropFilter: 'blur(2px)',
				backgroundColor: 'rgba(16, 16, 20, 0.70)',
				borderRadius: 12,
				overflow: 'hidden',
				position: 'relative',
			}}
			onHoverIn={() => {
				setIsHovered(true);
			}}
			onHoverOut={() => {
				setIsHovered(false);
				setIsSlided(false);
			}}
		>
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
				animate={{
					translateY: -55,
				}}
				onTransitionComplete={() => {
					if (isHovered) {
						setIsSlided(true);
					}
				}}
			>
				<View
					style={{
						width: CardDims.width,
						height: CardDims.height,
						position: 'relative',
					}}
				>
					<Image
						source={{ uri: props.song.cover }}
						style={{
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
									{props.song.artist?.name}
								</Text>
							</View>

							<LikeButton
								color="#6075F9"
								onPress={() => {
									console.log('like');
									mutate({ songId: props.song.id, like: !isLiked });
								}}
								isLiked={isLiked}
							/>
						</View>
					</View>
				</View>
			</PresenceTransition>
			{Platform.OS === 'web' && (
				<PresenceTransition
					style={{
						position: 'absolute',
						bottom: 35,
						left: CardDims.width / 2 - 20,
					}}
					visible={isSlided}
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
					}}
				>
					<Hoverable
						onHoverIn={() => {
							setIsPlayHovered(true);
						}}
						onHoverOut={() => {
							setIsPlayHovered(false);
						}}
					>
						<View
							onClick={(e) => {
								e.stopPropagation();
								props.onPress();
							}}
							style={{
								width: 40,
								height: 40,
								borderRadius: 100,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								backgroundColor: isPlayHovered
									? 'rgba(96, 117, 249, 0.9)'
									: 'rgba(96, 117, 249, 0.7)',
							}}
						>
							<Ionicons name="play-outline" color={'white'} size={20} rounded="sm" />
						</View>
					</Hoverable>
				</PresenceTransition>
			)}
		</Pressable>
	);
};

SongCardInfo.defaultProps = {
	onPress: () => {},
	onPlay: () => {},
};

export default SongCardInfo;
