import { VStack, Image, Heading, IconButton, Icon, Container } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import { useQuery } from 'react-query';
import { LoadingView } from '../components/Loading';
import API from '../API';
import { useNavigation } from '../Navigation';

const handleFavorite = () => {};

type ArtistDetailsViewProps = {
	artistId: number;
};

const ArtistDetailsView = ({ artistId }: ArtistDetailsViewProps) => {
	const navigation = useNavigation();
	const {
		isLoading,
		data: artistData,
		isError,
	} = useQuery(['artist', artistId], () => API.getArtist(artistId));

	if (isLoading) {
		return <LoadingView />;
	}

	if (isError) {
		navigation.navigate('Error');
	}

	return (
		<SafeAreaView>
			<Container m={3}>
				<Image
					source={{ uri: 'https://picsum.photos/200' }}
					alt={artistData?.name}
					size={20}
					borderRadius="full"
				/>
				<VStack space={3}>
					<Heading>{artistData?.name}</Heading>
					<IconButton
						icon={<Icon as={Ionicons} name="heart" size={6} color="red.500" />}
						onPress={() => handleFavorite()}
						variant="unstyled"
						_pressed={{ opacity: 0.6 }}
					/>
				</VStack>
			</Container>
		</SafeAreaView>
	);
};

export default ArtistDetailsView;
