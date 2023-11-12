import React, { useCallback, useState, useMemo } from 'react';
import { FlatList, HStack, View, useBreakpointValue, useTheme, Text, Row } from 'native-base';
import { ActivityIndicator, StyleSheet } from 'react-native';
import MusicItem, { MusicItemType } from './MusicItem';
import ButtonBase from './ButtonBase';
import { ArrowDown2, Chart2, ArrowRotateLeft, Cup, Icon } from 'iconsax-react-native';
import useColorScheme from '../../hooks/colorScheme';

interface MusicItemTitleProps {
	text: string;
	icon: Icon;
	isBigScreen: boolean;
}

const MusicItemTitle = React.memo((props: MusicItemTitleProps) => {
  const colorScheme = useColorScheme();

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
          {props.isBigScreen && (
              <Text fontSize="lg" style={{ paddingRight: 8 }}>
                  {props.text}
              </Text>
          )}
          <props.icon
              size={18}
              color={colorScheme === 'light' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'}
          />
      </Row>
  );
});

type MusicListProps = {
  initialMusics: MusicItemType[];
  loadMoreMusics: (page: number, musics: MusicItemType[]) => Promise<MusicItemType[]>;
  musicsPerPage: number;
};

const MusicList: React.FC<MusicListProps> = React.memo(({ initialMusics, loadMoreMusics, musicsPerPage }) => {
  const [musicListState, setMusicListState] = useState({
    allMusics: initialMusics,
    displayedMusics: initialMusics.slice(0, musicsPerPage),
    currentPage: 1,
    loading: false,
    hasMoreMusics: true,
  });
  const { colors } = useTheme();
  const screenSize = useBreakpointValue({ base: 'small', md: 'md', xl: 'xl' });
  const isBigScreen = screenSize === 'xl';

  const loadMoreMusicItems = useCallback(async () => {
    if (musicListState.loading || !musicListState.hasMoreMusics) {
      return;
    }

    setMusicListState(prevState => ({ ...prevState, loading: true }));

    let hasMoreMusics = true;
    const nextEndIndex = (musicListState.currentPage + 1) * musicsPerPage;
    let updatedAllMusics = musicListState.allMusics;

    if (updatedAllMusics.length <= nextEndIndex) {
        const newMusics = await loadMoreMusics(musicListState.currentPage, updatedAllMusics);
        updatedAllMusics = [...updatedAllMusics, ...newMusics];
        hasMoreMusics = newMusics.length > 0;
    }

    setMusicListState(prevState => ({
        ...prevState,
        allMusics: updatedAllMusics,
        displayedMusics: updatedAllMusics.slice(0, nextEndIndex),
        currentPage: prevState.currentPage + 1,
        loading: false,
        hasMoreMusics: hasMoreMusics,
    }));
  }, [musicsPerPage, loadMoreMusics, musicListState]);

  const headerComponent = useMemo(() => (
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
          style={{ flex: 4, width: '100%', justifyContent: 'center', paddingRight: 60 }}
      >
          Song
      </Text>
      {[
          { text: 'level', icon: Chart2 },
          { text: 'lastScore', icon: ArrowRotateLeft },
          { text: 'BastScore', icon: Cup },
      ].map((value) => (
          <MusicItemTitle
              key={value.text + 'key'}
              text={value.text}
              icon={value.icon}
              isBigScreen={isBigScreen}
          />
      ))}
    </HStack>
  ), [colors.coolGray[500], isBigScreen]);

  return (
    <FlatList
      style={styles.container}
      ListHeaderComponent={headerComponent}
      data={musicListState.displayedMusics}
      renderItem={({ item }) => <MusicItem style={{marginBottom: 2}} {...item} />}
      keyExtractor={(item) => item.artist + item.song}
      ListFooterComponent={musicListState.hasMoreMusics ?
        (<View style={styles.footerContainer}>
          {musicListState.loading ? (
              <ActivityIndicator color={colors.primary[300]} />
          ) : (
              <ButtonBase
                  style={{borderRadius: 999}}
                  onPress={loadMoreMusicItems}
                  icon={ArrowDown2}
              />
          )}
        </View>) : null
      }
    />
  );
});

const styles = StyleSheet.create({
  container: {
      flex: 1,
      gap: 2,
      borderRadius: 10,
      overflow: 'hidden',
  },
  footerContainer : {
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
  }
});

export default MusicList;
