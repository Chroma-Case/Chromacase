import React from "react";
import { Text, View } from 'react-native';
import { Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import i18n, { AvailableLanguages, DefaultLanguage, translate } from "../i18n/i18n";
import { useLanguage } from "../state/LanguageSlice";
import { unsetUserToken } from "../state/UserSlice";

const HomeView = ({navigation}) => {
  const dispatch = useDispatch();
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
      <Button onPress={() => navigation.navigate('Settings')}>{ translate('settingsBtn')}</Button>
      <Text style={{ textAlign: "center" }}>Current language: { language }</Text>
    </View>
  );
}

export default HomeView;
