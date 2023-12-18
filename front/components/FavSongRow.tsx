import { HStack, IconButton, Image, Text } from 'native-base';
import RowCustom from './RowCustom';
import TextButton from './TextButton';
import { MaterialIcons } from '@expo/vector-icons';
import DurationComponent from './DurationComponent';
import Song from '../models/Song';
import { useLikeSongMutation } from '../utils/likeSongMutation';

type FavSongRowProps = {
	song: Song;
	addedDate: Date;
	onPress: () => void;
};

const FavSongRow = ({ song, addedDate, onPress }: FavSongRowProps) => {
	const { mutate } = useLikeSongMutation();

	return (
		<RowCustom width={'100%'}>
			<HStack px={2} space={5} justifyContent={'space-between'}>
				<Image
					flexShrink={0}
					flexGrow={0}
					pl={10}
					style={{ zIndex: 0, aspectRatio: 1, borderRadius: 5 }}
					source={{ uri: song.cover }}
					alt={song.name}
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
						{song.name}
					</Text>
					<Text
						style={{
							flexShrink: 0,
						}}
						fontSize={'sm'}
					>
						{addedDate.toLocaleDateString()}
					</Text>
					<DurationComponent length={song.difficulties.length} />
				</HStack>
				<IconButton
					colorScheme="primary"
					variant={'ghost'}
					borderRadius={'full'}
					onPress={() => {
						mutate({ songId: song.id, like: false });
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
