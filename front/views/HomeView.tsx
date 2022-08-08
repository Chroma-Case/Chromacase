import React from "react";
import { Text, View } from 'react-native';
import { Button } from "react-native-paper";
import { useDispatch, useSelector, useStore } from "react-redux";
import i18n, { AvailableLanguages, translate } from "../i18n/i18n";
import { useLanguage } from "../state/LanguageSlice";
import { unsetUserToken } from "../state/UserSlice";

const HomeView = () => {
  const dispatch = useDispatch();
  const language: AvailableLanguages = useSelector((state) => state.language.value);
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text style={{ textAlign: "center" }}>This is the Home Screen</Text>
      <Button onPress={() => dispatch(unsetUserToken())}>{ translate('signoutBtn') }</Button>
      <Button onPress={() => {
        switch (language) {
          case 'en':
            dispatch(useLanguage('fr'));
            break;
          default:
            dispatch(useLanguage('en'));
            break;
        }
      }}>Change language</Button>
    </View>
  );
}

export default HomeView;
