import { FlatList, View } from "native-base";
import MusicItem, { MusicItemType } from "./MusicItem";
import IconButton from "./IconButton";
import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import { ArrowCircleDown, ArrowDown } from "iconsax-react-native";
import { StyleSheet } from 'react-native';

type MusicListProps = {
    musics: MusicItemType[];
}

const MusicList: React.FC<MusicListProps> = ({musics}) => {
    const [musicData, setMusicData] = useState<MusicItemType[]>(musics);
    const [loading, setLoading] = useState(false);
  
    // Supposons que vous ayez une fonction pour charger plus de données (simulée ici avec un setTimeout).
    const loadMoreMusicItems = () => {
      if (!loading) {
        setLoading(true);
        setTimeout(() => {
          const moreItems: MusicItemType[] = [
            // ... ajoutez de nouveaux éléments ici
          ];
          setMusicData((currentItems) => [...currentItems, ...moreItems]);
          setLoading(false);
        }, 2000); // Simule un appel réseau avec un délai de 2 secondes.
      }
    };
  
    return (
      <View style={styles.container}>
        <FlatList
          data={musicData}
          renderItem={({ item }) => (
            <MusicItem
              image={item.image}
              liked={item.liked}
              onLike={item.onLike}
              onPlay={item.onPlay}
              level={item.level}
              lastScore={item.lastScore}
              bestScore={item.bestScore}
              artist={item.artist}
              song={item.song}
            />
          )}
          keyExtractor={(item) => item.artist + item.song}
          ListFooterComponent={() => (
            loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
          )}
        />
        <IconButton
            onPress={loadMoreMusicItems}
            color={"#000"}
            icon={ArrowCircleDown}
            />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    // Ajoutez d'autres styles si nécessaire.
  });
  
  export default MusicList;