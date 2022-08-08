import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from 'react-native';
import { Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { setUserToken } from "../state/UserSlice";

const AuthenticationView = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text style={{ textAlign: "center" }}>{ t('welcome') }</Text>
      <Button onPress={() => dispatch(setUserToken('kkkk'))}>
      { t('signinBtn') }
      </Button>
    </View>
  );
}


export default AuthenticationView;
