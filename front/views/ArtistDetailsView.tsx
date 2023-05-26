import { VStack, Text, Image, Heading, IconButton, Icon, Container } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import { useQuery } from 'react-query';
import LoadingComponent from '../components/Loading';
import API from '../API';

const handleFavorite = () => {
    
};

const ArtistDetailsView = ({ artistId }: any) => {
    const { isLoading, data: artistData, error } = useQuery(['artist', artistId], () => API.getArtist(artistId));

    if (isLoading) {
        return <LoadingComponent />;
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