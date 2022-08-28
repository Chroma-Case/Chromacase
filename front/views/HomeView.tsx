import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from 'react-native';
import { Button, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { AvailableLanguages, DefaultLanguage, translate } from "../i18n/i18n";
import { useLanguage } from "../state/LanguageSlice";
import { unsetUserToken } from "../state/UserSlice";

const HomeView = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const language: AvailableLanguages = useSelector((state) => state.language.value);
  return (
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
      <Button onPress={() =>  navigation.navigate('Song', { songId: 1 }) }>Go to Song Page</Button>
      <Text style={{ textAlign: "center" }}>Current language: { language }</Text>
    </View>
  );
}

export default HomeView;
