import React, { useCallback, useState, useMemo, memo } from 'react';
import { FlatList, HStack, View, useBreakpointValue, useTheme, Text, Row } from 'native-base';
import { ActivityIndicator, StyleSheet } from 'react-native';
import MusicItem, { MusicItemType } from './MusicItem';
import ButtonBase from './ButtonBase';
import { ArrowDown2, Chart2, ArrowRotateLeft, Cup, Icon } from 'iconsax-react-native';
import { translate } from '../../i18n/i18n';

// Props type definition for MusicItemTitle.
interface MusicItemTitleProps {
	/** Text to be displayed when the screen size is large. */
	text: string;

	/** Icon component to be used. */
	icon: Icon;

	/** Flag to indicate if the screen size is large enough to display additional text. */
	isBigScreen: boolean;
}

function MusicItemTitleComponent(props: MusicItemTitleProps) {
	const { colors } = useTheme();

	return (
		<Row
			style={{
				display: 'flex',
				flex: 1,
				maxWidth: props.isBigScreen ? 150 : 50,
				height: '100%',
				alignItems: 'center',
				justifyContent: props.isBigScreen ? 'flex-end' : 'center',
			}}
		>
			{/* Conditional rendering based on screen size. */}
			{props.isBigScreen && (
				<Text fontSize="lg" style={{ paddingRight: 8 }}>
					{props.text}
				</Text>
			)}
			{/* Icon with color based on the current color scheme. */}
			<props.icon size={18} color={colors.text[700]} />
		</Row>
	);
}

// MusicItemTitle component, memoized for performance.
const MusicItemTitle = memo(MusicItemTitleComponent);

/**
 * Define the type for the MusicList component props.
 */
type MusicListProps = {
	/**
	 * Music items available for display. Not all items may be displayed initially;
	 * depends on 'musicsPerPage'.
	 */
	initialMusics: MusicItemType[];

	/**
	 * Function to load more music items asynchronously. Called with current page number
	 * and the list of all music items. Should return a Promise with additional music items.
	 */
	loadMoreMusics?: (page: number, musics: MusicItemType[]) => Promise<MusicItemType[]>;

	/**
	 * Number of music items to display per page. Determines initial and additional items displayed.
	 */
	musicsPerPage?: number;
};

/**
 * `MusicList` Component
 *
 * A responsive and dynamic list component designed for displaying a collection of music items.
 * It allows for loading and rendering an initial set of music items and provides functionality
 * to load more items dynamically as needed.
 *
 * Features:
 * - Dynamically loads and displays music items based on the provided `initialMusics` and `musicsPerPage`.
 * - Supports pagination through the `loadMoreMusics` function, which loads additional music items when invoked.
 * - Adapts its layout responsively based on screen size for optimal viewing across different devices.
 * - Includes a loading indicator to inform users when additional items are being loaded.
 * - Conditionally renders a 'Load More' button to fetch more music items, hidden when no more items are available.
 *
 * Usage:
 *
 * ```jsx
 * <MusicList
 *   initialMusics={initialMusicData}
 *   loadMoreMusics={(page, currentMusics) => loadAdditionalMusics(page, currentMusics)}
 *   musicsPerPage={10}
 * />
 * ```
 *
 * Note:
 * - The `MusicList` is designed to handle a potentially large number of music items efficiently,
 *   making it suitable for use cases where the list of items is expected to grow over time.
 * - The layout and styling are optimized for performance and responsiveness.
 */
function MusicListComponent({
	initialMusics,
	loadMoreMusics,
	musicsPerPage = loadMoreMusics ? 50 : initialMusics.length,
}: MusicListProps) {
	// State initialization for MusicList.
	// 'allMusics': all music items.
	// 'displayedMusics': items displayed per page.
	// 'currentPage': current page in pagination.
	// 'loading': indicates if more items are being loaded.
	// 'hasMoreMusics': flag for more items availability.
	const [musicListState, setMusicListState] = useState({
		allMusics: initialMusics,
		displayedMusics: initialMusics.slice(0, musicsPerPage),
		currentPage: 1,
		loading: false,
		hasMoreMusics: initialMusics.length > musicsPerPage || !!loadMoreMusics,
	});
	const { colors } = useTheme();
	const screenSize = useBreakpointValue({ base: 'small', md: 'md', xl: 'xl' });
	const isBigScreen = screenSize === 'xl';

	// Loads additional music items.
	// Uses useCallback to avoid unnecessary redefinitions on re-renders.
	const loadMoreMusicItems = useCallback(async () => {
		if (musicListState.loading || !musicListState.hasMoreMusics) {
			return;
		}

		setMusicListState((prevState) => ({ ...prevState, loading: true }));

		let hasMoreMusics = true;
		const nextEndIndex = (musicListState.currentPage + 1) * musicsPerPage;
		let updatedAllMusics = musicListState.allMusics;

		if (loadMoreMusics && updatedAllMusics.length <= nextEndIndex) {
			const newMusics = await loadMoreMusics(musicListState.currentPage, updatedAllMusics);
			updatedAllMusics = [...updatedAllMusics, ...newMusics];
			hasMoreMusics = newMusics.length > 0;
		} else {
			hasMoreMusics = updatedAllMusics.length > nextEndIndex;
		}

		setMusicListState((prevState) => ({
			...prevState,
			allMusics: updatedAllMusics,
			displayedMusics: updatedAllMusics.slice(0, nextEndIndex),
			currentPage: prevState.currentPage + 1,
			loading: false,
			hasMoreMusics: hasMoreMusics,
		}));
	}, [musicsPerPage, loadMoreMusics, musicListState]);

	// useMemo to optimize performance by memorizing the header,
	// preventing unnecessary re-renders.
	const headerComponent = useMemo(
		() => (
			<HStack
				space={isBigScreen ? 1 : 2}
				style={{
					backgroundColor: colors.coolGray[500],
					paddingHorizontal: isBigScreen ? 8 : 16,
					paddingVertical: 12,
					marginBottom: 2,
				}}
			>
				<Text
					fontSize="lg"
					style={{
						flex: 4,
						width: '100%',
						justifyContent: 'center',
						paddingRight: 60,
					}}
				>
					{translate('musicListTitleSong')}
				</Text>
				{[
					{ text: translate('musicListTitleLevel'), icon: Chart2 },
					{ text: translate('musicListTitleLastScore'), icon: ArrowRotateLeft },
					{ text: translate('musicListTitleBestScore'), icon: Cup },
				].map((value) => (
					<MusicItemTitle
						key={value.text + 'key'}
						text={value.text}
						icon={value.icon}
						isBigScreen={isBigScreen}
					/>
				))}
			</HStack>
		),
		[colors.coolGray[500], isBigScreen]
	);

	// FlatList: Renders list efficiently, only rendering visible items.
	return (
		<FlatList
			style={styles.container}
			ListHeaderComponent={headerComponent}
			data={musicListState.displayedMusics}
			renderItem={({ item }) => <MusicItem style={{ marginBottom: 2 }} {...item} />}
			keyExtractor={(item) => item.artist + item.song}
			ListFooterComponent={
				musicListState.hasMoreMusics ? (
					<View style={styles.footerContainer}>
						{musicListState.loading ? (
							<ActivityIndicator color={colors.primary[300]} />
						) : (
							<ButtonBase
								style={{ borderRadius: 999 }}
								onPress={loadMoreMusicItems}
								icon={ArrowDown2}
							/>
						)}
					</View>
				) : null
			}
		/>
	);
}

// Styles for the MusicList component
const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 2,
		borderRadius: 10,
		overflow: 'hidden',
	},
	footerContainer: {
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

// Using `memo` to optimize rendering performance by memorizing the component's output.
// This ensures that the component only re-renders when its props change.
const MusicList = memo(MusicListComponent);

export default MusicList;
