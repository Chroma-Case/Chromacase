/* eslint-disable react/prop-types */
import React, { useMemo, memo } from 'react';
import { StyleSheet } from 'react-native';
import { Column, HStack, Row, Stack, Text, useBreakpointValue, useTheme } from 'native-base';
import { HeartAdd, HeartRemove, Play } from 'iconsax-react-native';
import { Image } from 'react-native';
import IconButton from './IconButton';
import Spacer from '../../components/UI/Spacer';
import { useTranslation } from 'react-i18next';

/**
 * Props for the MusicItem component.
 */
interface MusicItemProps {
	/** The artist's name. */
	artist: string;

	/** The song's title. */
	song: string;

	/** The URL for the song's cover image. */
	image: string;

	/** The level of the song difficulty . */
	level: number;

	/** The last score achieved for this song. */
	lastScore: number;

	/** The highest score achieved for this song. */
	bestScore: number;

	/** Indicates whether the song is liked/favorited by the user. */
	liked: boolean;

	/** Callback function triggered when the like button is pressed. */
	onLike: () => void;

	/** Callback function triggered when the song is played. */
	onPlay?: () => void;
}

// Custom hook to handle the number formatting based on the current user's language.
function useNumberFormatter() {
	const { i18n } = useTranslation();

	// Memoizing the number formatter to avoid unnecessary recalculations.
	// It will be recreated only when the language changes.
	const formatter = useMemo(() => {
		return new Intl.NumberFormat(i18n.language, {
			notation: 'compact',
			compactDisplay: 'short',
		});
	}, [i18n.language]);

	return (num: number) => formatter.format(num);
}

/**
 * `MusicItem` Component
 *
 * Display individual music tracks with artist information, cover image, song title, and associated stats.
 * Designed for optimal performance and responsiveness across different screen sizes.
 *
 * Features:
 * - Displays artist name, song title, and track cover image.
 * - Indicates user interaction with a like/favorite feature.
 * - Provides a play button for user interaction.
 * - Adapts its layout and design responsively according to screen size.
 * - Optimized performance to ensure smooth rendering even in long lists.
 * - Automatic number formatting based on user's language preference.
 *
 * Usage:
 *
 * ```jsx
 * <MusicItem
 *     artist="John Doe"
 *     song="A Beautiful Song"
 *     image="https://example.com/image.jpg"
 *     level={5}
 *     lastScore={3200}
 *     bestScore={5000}
 *     liked={true}
 *     onLike={() => {() => console.log('Music liked!')}}
 *     onPlay={() => {() => console.log('Play music!')}
 * />
 * ```
 *
 * Note:
 * - The number formatting for `level`, `lastScore`, and `bestScore` adapts automatically based on the user's language preference using the i18n module.
 * - Given its optimized performance characteristics, this component is suitable for rendering in lists with potentially hundreds of items.
 */
function MusicItemComponent(props: MusicItemProps) {
	// Accessing theme colors and breakpoint values for responsive design
	const { colors } = useTheme();
	const screenSize = useBreakpointValue({ base: 'small', md: 'md', xl: 'xl' });
	const formatNumber = useNumberFormatter();

	// Styles are memoized to optimize performance.
	const styles = useMemo(
		() =>
			StyleSheet.create({
				container: {
					backgroundColor: colors.coolGray[500],
					paddingRight: screenSize === 'small' ? 8 : 16,
				},
				playButtonContainer: {
					zIndex: 1,
					position: 'absolute',
					right: -8,
					bottom: -6,
				},
				playButton: {
					backgroundColor: colors.primary[300],
					borderRadius: 999,
				},
				image: {
					position: 'relative',
					width: screenSize === 'xl' ? 80 : 60,
					height: screenSize === 'xl' ? 80 : 60,
				},
				artistText: {
					color: colors.text[700],
					fontWeight: 'bold',
				},
				songContainer: {
					width: '100%',
				},
				stats: {
					display: 'flex',
					flex: 1,
					maxWidth: screenSize === 'xl' ? 150 : 50,
					height: '100%',
					alignItems: 'center',
					justifyContent: screenSize === 'xl' ? 'flex-end' : 'center',
				},
			}),
		[colors, screenSize]
	);

	// Memoizing formatted numbers to avoid unnecessary computations.
	const formattedLevel = useMemo(() => formatNumber(props.level), [props.level]);
	const formattedLastScore = useMemo(() => formatNumber(props.lastScore), [props.lastScore]);
	const formattedBestScore = useMemo(() => formatNumber(props.bestScore), [props.bestScore]);

	return (
		<HStack space={screenSize === 'xl' ? 2 : 1} style={styles.container}>
			<Stack style={{ position: 'relative', overflow: 'hidden' }}>
				<IconButton
					containerStyle={styles.playButtonContainer}
					style={styles.playButton}
					padding={8}
					onPress={props.onPlay}
					color="#FFF"
					icon={Play}
					variant="Bold"
					size={24}
				/>
				<Image source={{ uri: props.image }} style={styles.image} />
			</Stack>
			<Column style={{ flex: 4, width: '100%', justifyContent: 'center' }}>
				<Text numberOfLines={1} style={styles.artistText}>
					{props.artist}
				</Text>
				{screenSize === 'xl' && <Spacer height="xs" />}
				<Row space={2} style={styles.songContainer}>
					<Text numberOfLines={1}>{props.song}</Text>
					<IconButton
						colorActive={colors.text[700]}
						color={colors.primary[300]}
						icon={HeartAdd}
						iconActive={HeartRemove}
						activeVariant="Bold"
						size={screenSize === 'xl' ? 24 : 18}
						isActive={props.liked}
						onPress={props.onLike}
					/>
				</Row>
			</Column>
			{[formattedLevel, formattedLastScore, formattedBestScore].map((value, index) => (
				<Text key={index} style={styles.stats}>
					{value}
				</Text>
			))}
		</HStack>
	);
}

// Using `memo` to optimize rendering performance by memorizing the component's output.
// This ensures that the component only re-renders when its props change.
const MusicItem = memo(MusicItemComponent);

export default MusicItem;
