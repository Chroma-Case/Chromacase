import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from 'react-native';
import { Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import i18n from "../i18n/i18n";
import { unsetUserToken } from "../state/UserSlice";

const HomeView = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text style={{ textAlign: "center" }}>This is the Home Screen</Text>
      <Button onPress={() => dispatch(unsetUserToken())}>{ t('signoutBtn') }</Button>
      <Button onPress={() => i18n.changeLanguage('fr')}>Change language</Button>
    </View>
  );
}

export default HomeView;
