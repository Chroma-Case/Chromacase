import { HStack, Image, Text } from 'native-base';
import Song, { SongWithArtist } from '../models/Song';
import RowCustom from './RowCustom';
import TextButton from './TextButton';

type SongRowProps = {
	song: Song | SongWithArtist; // TODO: remove Song
	onPress: () => void;
};

const SongRow = ({ song, onPress }: SongRowProps) => {
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
						{song.artistId ?? 'artist'}
					</Text>
				</HStack>
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

export default SongRow;