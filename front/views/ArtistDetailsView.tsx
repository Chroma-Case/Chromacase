import { VStack, Text, Box, Image, Heading, IconButton, Icon, Container, Center, useBreakpointValue } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import { useQuery } from 'react-query';
import LoadingComponent from '../components/Loading';
import API from '../API';
import Song from '../models/Song';
import SongRow from '../components/SongRow';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

const ArtistDetailsView = ({ artistId }: any) => {
    const { isLoading: isLoadingArtist, data: artistData, error: errorArtist } = useQuery(['artist', artistId], () => API.getArtist(artistId));
    // const { isLoading: isLoadingSongs, data: songData = [], error: errorSongs } = useQuery(['songs', artistId], () => API.getSongsByArtist(artistId))
    const screenSize = useBreakpointValue({ base: "small", md: "big" });
	const isMobileView = screenSize == "small";
    const navigation = useNavigation();
    const [merde, setMerde] = useState<any>(null);

    useEffect(() => {
        // Code to be executed when the component is focused
        console.warn('Component focused!');
        setMerde(API.getSongsByArtist(112));
        // Call your function or perform any other actions here
    }, []);

    if (isLoadingArtist) {
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
                        {merde.map((comp, index) => (
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
