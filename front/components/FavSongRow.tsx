import { HStack, IconButton, Image, Text } from 'native-base';
import RowCustom from './RowCustom';
import TextButton from './TextButton';
import { LikedSongWithDetails } from '../models/LikedSong';
import { MaterialIcons } from '@expo/vector-icons';
import API from '../API';
import DurationComponent from './DurationComponent';

type FavSongRowProps = {
	FavSong: LikedSongWithDetails; // TODO: remove Song
	onPress: () => void;
};

const FavSongRow = ({ FavSong, onPress }: FavSongRowProps) => {
	return (
		<RowCustom width={'100%'}>
			<HStack px={2} space={5} justifyContent={'space-between'}>
				<Image
					flexShrink={0}
					flexGrow={0}
					pl={10}
					style={{ zIndex: 0, aspectRatio: 1, borderRadius: 5 }}
					source={{ uri: FavSong.details.cover }}
					alt={FavSong.details.name}
					borderColor={'white'}
					borderWidth={1}
				/>
				<HStack
					style={{
						display: 'flex',
						flexShrink: 1,
						flexGrow: 1,
						alignItems: 'center',
						justifyContent: 'flex-start',
					}}
					space={6}
				>
					<Text
						style={{
							flexShrink: 1,
						}}
						isTruncated
						pl={5}
						maxW={'100%'}
						bold
						fontSize="md"
					>
						{FavSong.details.name}
					</Text>
					<Text
						style={{
							flexShrink: 0,
						}}
						fontSize={'sm'}
					>
						{FavSong.addedDate.toLocaleDateString()}
					</Text>
					<DurationComponent length={FavSong.details.details.length} />
				</HStack>
				<IconButton
					colorScheme="primary"
					variant={'ghost'}
					borderRadius={'full'}
					onPress={() => {
						API.removeLikedSong(FavSong.songId);
					}}
					_icon={{
						as: MaterialIcons,
						name: 'favorite',
					}}
				/>
				<TextButton
					flexShrink={0}
					flexGrow={0}
					translate={{ translationKey: 'playBtn' }}
					colorScheme="primary"
					variant={'outline'}
					size="sm"
					mr={5}
					onPress={onPress}
				/>
			</HStack>
		</RowCustom>
	);
};

export default FavSongRow;
