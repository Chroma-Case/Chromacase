import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from 'react-native';
import { useSelector } from "react-redux";
import { AvailableLanguages, translate } from "../../i18n/i18n";
import ProgressBar from "../../components/progressBar";
import { Button, Text } from "react-native-paper";
import Row from "../../components/row";
import Competencies from "./Competencies";
import LastSearched from "./SearchHistory";
import Suggestions from "./Suggestions";
import RecentlyPlayed from "./PlayHistory";
import SettingsButton from "./Settings";

const SearchButton = () => {
  const language: AvailableLanguages = useSelector((state) => state.language.value);
  const navigation = useNavigation();

  return (
      <Button>{ translate('searchBtn') }</Button>
  );
}

/*               OBJECTIF
*  [message                      progress bouton]
*  [morceaux recommandés               recherche]
*  [stats     dernierement joués      historique]
*/

const messageStyle = {
  width: '25%',
  padding: 20,
  fontSize: 40,
  fontWeight: 'bold',
}

const HomeView = () => {
  const language: AvailableLanguages = useSelector((state) => state.language.value);
  const Username = "Username";

  return (
    <View style={{flexDirection: 'column'}}>
      <View style={{ flexDirection: 'row'}}>
        <Text style={messageStyle}> { translate('welcomeMessage') }{Username} !</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end'}}>
          <ProgressBar progress={69} maxValue={300} barWidth={55} title="Level 3"/>
          <SettingsButton/>
        </View>
      </View>
      <View style={{ flexDirection: 'row'}}>
       <Suggestions/>
       <SearchButton/>
      </View>
      <View style={{ flexDirection: 'row'}}>
        <Competencies/>
        <RecentlyPlayed/>
        <LastSearched/>
      </View>
    </View>
  );
}

export default HomeView;
