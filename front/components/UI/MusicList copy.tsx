import { FlatList, HStack, View, useBreakpointValue, useTheme, Text, Row } from "native-base";
import MusicItem, { MusicItemType } from "./MusicItem";
import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import { ArrowDown2, ArrowRotateLeft, Chart2, Cup, Icon } from "iconsax-react-native";
import { StyleSheet } from 'react-native';
import ButtonBase from "./ButtonBase";
import useColorScheme from "../../hooks/colorScheme";

interface MusicItemTitleProps {
	text: string;
	icon: Icon;
	isBigScreen: boolean;
}

const MusicItemTitle = (props: MusicItemTitleProps) => {
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
};

type MusicListProps = {
  initialMusics: MusicItemType[];
  loadMoreMusics: (page: number) => Promise<MusicItemType[]>; // fonction pour charger plus de musiques
};

const MusicList: React.FC<MusicListProps> = ({initialMusics}) => {
    const [musicData, setMusicData] = useState<MusicItemType[]>(initialMusics);
    const [loading, setLoading] = useState(false);
  	const { colors } = useTheme();
    const screenSize = useBreakpointValue({ base: 'small', md: 'md', xl: 'xl' });
    const isSmallScreen = screenSize === 'small';
    const isBigScreen = screenSize === 'xl';

    const loadMoreMusicItems = () => {
      if (!loading) {
        setLoading(true);
        setTimeout(() => {
          const moreItems: MusicItemType[] = [
          ];
          setMusicData((currentItems) => [...currentItems, ...moreItems]);
          setLoading(false);
        }, 2000); // Simule un appel réseau avec un délai de 2 secondes.
      }
    };
  
    return (
      <View>
        <View style={styles.container}>
          <HStack
            space={isSmallScreen ? 1 : 2}
            style={{
              backgroundColor: colors.coolGray[500],
              paddingHorizontal: isSmallScreen ? 8 : 16,
              paddingVertical: 12,
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
          <FlatList
            data={musicData}
            renderItem={({ item }) => <MusicItem style={{marginBottom: 2}} {...item} />}
            keyExtractor={(item) => item.artist + item.song}
          />
        </View>
        <View style={styles.footerContainer}>
          {loading ? (
              <ActivityIndicator
                color={colors.primary[300]}
              />
          ) : (
              <ButtonBase
                style={{borderRadius: 999}}
                onPress={loadMoreMusicItems}
                icon={ArrowDown2}
              />
          )}
        </View>
      </View>
    );
};

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