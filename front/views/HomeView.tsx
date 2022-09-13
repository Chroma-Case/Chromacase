import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { AvailableLanguages, DefaultLanguage, translate } from "../i18n/i18n";
import { useLanguage } from "../state/LanguageSlice";
import { unsetUserToken } from "../state/UserSlice";
import ProgressBar from "../components/progressBar";
import SongCard from "../components/songCard";
import { Button, Text } from "react-native-paper";
import Row from "../components/row";

const Suggestions = () => {
  return (
    <Row>
      <SongCard albumCover="https://i.discogs.com/yHqu3pnLgJq-cVpYNVYu6mE-fbzIrmIRxc6vES5Oi48/rs:fit/g:sm/q:90/h:556/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE2NjQ2/ODUwLTE2MDkwNDU5/NzQtNTkxOS5qcGVn.jpeg"
                songTitle="Dramaturgy"
                artistName="Eve MV"/>
      <SongCard albumCover="https://i.discogs.com/yHqu3pnLgJq-cVpYNVYu6mE-fbzIrmIRxc6vES5Oi48/rs:fit/g:sm/q:90/h:556/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE2NjQ2/ODUwLTE2MDkwNDU5/NzQtNTkxOS5qcGVn.jpeg"
                songTitle="Shinkai"
                artistName="Eve MV"/>
      <SongCard albumCover="https://i.discogs.com/yHqu3pnLgJq-cVpYNVYu6mE-fbzIrmIRxc6vES5Oi48/rs:fit/g:sm/q:90/h:556/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE2NjQ2/ODUwLTE2MDkwNDU5/NzQtNTkxOS5qcGVn.jpeg"
                songTitle="Don't replay the boredom"
                artistName="Eve MV"/>
      <SongCard albumCover="https://i.discogs.com/yHqu3pnLgJq-cVpYNVYu6mE-fbzIrmIRxc6vES5Oi48/rs:fit/g:sm/q:90/h:556/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE2NjQ2/ODUwLTE2MDkwNDU5/NzQtNTkxOS5qcGVn.jpeg"
                songTitle="Heart forecast"
                artistName="Eve MV"/>
    </Row>
  );
}

const SettingsButton = () => {
  const dispatch = useDispatch();
  const language: AvailableLanguages = useSelector((state) => state.language.value);

  return (
    <div>
      <Button onPress={() => dispatch(unsetUserToken())}>
        { translate('signoutBtn') }
      </Button>
      <Button onPress={() => {
        let newLanguage = DefaultLanguage;
        switch (language) {
          case 'en':
            newLanguage = 'fr';
            break;
          default:
            break;
        }
        dispatch(useLanguage(newLanguage));
      }}>
        { translate('changeLanguageBtn') }
      </Button>
    </div>
  )
}

const SearchButton = () => {
  const language: AvailableLanguages = useSelector((state) => state.language.value);
  const navigation = useNavigation();

  return (
    <div>
      <Button>
        { translate('searchBtn') }
      </Button>
      <Button onPress={() =>  navigation.navigate('Song', { songId: 1 }) }>Go to Song Page</Button>
      <Text style={{ textAlign: "center" }}>Current language: { language }</Text>
    </div>
  )
}

const Competencies = () => {
  return (
    <div>temp</div>
  );
}

const RecentlyPlayed = () => {
  return (
    <div>temp</div>
  );
}

const LastSearched = () => {
  return (
    <div>temp</div>
  );
}

const HomeView = () => {
  return (
    <View>
      <Row>
        <Text>MESSAGE</Text>
        <ProgressBar progress={69} maxValue={300} barWidth={50} title="Level 3"/>
        <SettingsButton/>
      </Row>
      <Row>
       <Suggestions/>
       <SearchButton/>
      </Row>
      <Row>
        <Competencies/>
        <RecentlyPlayed/>
        <LastSearched/>
      </Row>
    </View>
    /*
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text style={{ textAlign: "center" }}>This is the Home Screen</Text>
      <Button onPress={() => dispatch(unsetUserToken())}>{ translate('signoutBtn') }</Button>
      <Button onPress={() => {
        let newLanguage = DefaultLanguage;
        switch (language) {
          case 'en':
            newLanguage = 'fr';
            break;
          default:
            break;
        }
        dispatch(useLanguage(newLanguage));
      }}>Change language</Button>
      
    </View>
    */
  );
}

export default HomeView;
