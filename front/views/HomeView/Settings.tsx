import React from "react";
import { Button, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { AvailableLanguages, translate, DefaultLanguage } from "../../i18n/i18n";
import { useLanguage } from "../../state/LanguageSlice";
import { unsetUserToken } from "../../state/UserSlice";
import { useNavigation } from "@react-navigation/native";

const SettingsButton = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
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
        <Text style={{ textAlign: "center" }}>Current language: { language }</Text>
        <Button onPress={() =>  navigation.navigate('Song', { songId: 1 }) }> { translate('songPageBtn') }</Button>
      </div>
    )
}

export default SettingsButton;