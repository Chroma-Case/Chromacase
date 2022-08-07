import React from "react";
import { Text, View } from 'react-native';
import { Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { unsetUserToken } from "../state/UserSlice";

const HomeView = () => {
  const dispatch = useDispatch();
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text style={{ textAlign: "center" }}>This is the Home Screen</Text>
      <Button onPress={() => dispatch(unsetUserToken())}>Log out</Button>
    </View>
  );
}

export default HomeView;
