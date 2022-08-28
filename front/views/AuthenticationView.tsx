import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from 'react-native';
import { Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { translate } from "../i18n/i18n";
import { setUserToken } from "../state/UserSlice";

const AuthenticationView = () => {
  const dispatch = useDispatch();
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text style={{ textAlign: "center" }}>{ translate('welcome') }</Text>
      <Button onPress={() => dispatch(setUserToken('kkkk'))}>
      { translate('signinBtn') }
      </Button>
    </View>
  );
}


export default AuthenticationView;
