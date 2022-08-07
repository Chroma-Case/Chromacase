import React from "react";
import { Text, View } from 'react-native';
import { Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { setUserToken } from "../state/UserSlice";

const AuthenticationView = () => {
  const dispatch = useDispatch();
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text style={{ textAlign: "center" }}>Welcom to Chromacase</Text>
      <Text style={{ textAlign: "center" }}>This is the Authentication Screen</Text>
      <Button onPress={() => dispatch(setUserToken('kkkk'))}>
        Tap here to login
      </Button>
    </View>
  );
}


export default AuthenticationView;
