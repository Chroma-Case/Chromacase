import { VStack, Text, Box, Image, Heading, IconButton, Icon, Container, Center, useBreakpointValue } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import { useQuery } from 'react-query';
import LoadingComponent from '../components/Loading';
import API from '../API';
import Song from '../models/Song';
import SongRow from '../components/SongRow';
import { useNavigation } from '@react-navigation/native';

const ArtistDetailsView = ({ artistId }: any) => {
    const { isLoading, data: artistData, error } = useQuery(['artist', artistId], () => API.getArtist(artistId));
    const screenSize = useBreakpointValue({ base: "small", md: "big" });
	const isMobileView = screenSize == "small";
    let songData = [] as Song[];
    const navigation = useNavigation();

    if (isLoading) {
        return <Center m={10} ><LoadingComponent /></Center>;
    }

    return (
        <SafeAreaView>
            <Box>
                <Image
                source={{ uri: 'https://picsum.photos/200' }}
                alt={artistData?.name}
                size={'100%'}
                height={isMobileView ? 200 : 300}
                width={'100%'}
                resizeMode='cover'
                />
                <Box>
                    <Heading m={3} >Abba</Heading>
                    <Box>
                        {songData.map((comp, index) => (
                            <SongRow
                                key={index}
                                song={comp}
                                onPress={() => {
                                    API.createSearchHistoryEntry(comp.name, "song", Date.now());
                                    navigation.navigate("Song", { songId: comp.id });
                                }}
                            />
                            ))
                        }
                    </Box>

                </Box>
                </Box>
        </SafeAreaView>
    );
};

export default ArtistDetailsView;
