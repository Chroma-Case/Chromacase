import { memo, useRef } from 'react';
import { FlatList, HStack, View, useBreakpointValue, useTheme, Text, Row } from 'native-base';
import { ActivityIndicator, StyleSheet } from 'react-native';
import MusicItem from './MusicItem';
import ButtonBase from './ButtonBase';
import { ArrowDown2, ArrowRotateLeft, Cup, Icon } from 'iconsax-react-native';
import { translate } from '../../i18n/i18n';
import Song from '../../models/Song';
import { useLikeSongMutation } from '../../utils/likeSongMutation';
import { useNavigation } from '../../Navigation';
import { LoadingView } from '../Loading';

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

const Header = () => {
	const { colors } = useTheme();
	const screenSize = useBreakpointValue({ base: 'small', md: 'md', xl: 'xl' });
	const isBigScreen = screenSize === 'xl';

	return (
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
			<MusicItemTitle
				text={translate('musicListTitleLastScore')}
				icon={ArrowRotateLeft}
				isBigScreen={isBigScreen}
			/>
			<MusicItemTitle
				text={translate('musicListTitleBestScore')}
				icon={Cup}
				isBigScreen={isBigScreen}
			/>
		</HStack>
	);
};

function MusicListCC({
	musics,
	refetch,
	hasMore,
	isFetching,
	fetchMore,
}: {
	musics?: Song[];
	refetch: () => Promise<unknown>;
	hasMore?: boolean;
	isFetching: boolean;
	fetchMore?: () => Promise<unknown>;
}) {
	const { mutateAsync } = useLikeSongMutation();
	const navigation = useNavigation();
	const { colors } = useTheme();

	if (!musics) {
		return <LoadingView />;
	}

	return (
		<FlatList
			style={styles.container}
			ListHeaderComponent={Header}
			data={musics}
			renderItem={({ item: song }) => (
				<MusicItem
					artist={song.artist!.name}
					song={song.name}
					image={song.cover}
					lastScore={song.lastScore}
					bestScore={song.bestScore}
					liked={song.isLiked!}
					onLike={(state: boolean) => {
						mutateAsync({ songId: song.id, like: state }).then(() => refetch());
					}}
					onPlay={() => navigation.navigate('Play', { songId: song.id })}
					style={{ marginBottom: 2 }}
				/>
			)}
			keyExtractor={(item) => {
				return `${item.id}`;
			}}
			ListFooterComponent={
				hasMore ? (
					<View style={styles.footerContainer}>
						{isFetching ? (
							<ActivityIndicator color={colors.primary[300]} />
						) : (
							<ButtonBase
								style={{ borderRadius: 999 }}
								onPress={() => {
									fetchMore?.();
								}}
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
		flexGrow: 1,
		gap: 2,
		borderRadius: 10,
	},
	footerContainer: {
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default MusicListCC;
