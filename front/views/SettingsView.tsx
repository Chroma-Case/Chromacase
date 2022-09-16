import React from 'react';
import { Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { unsetUserToken } from '../state/UserSlice';
import { Button, Switch } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "../state/LanguageSlice";

import Theme from '../Theme'
import i18n, { AvailableLanguages, DefaultLanguage, translate } from "../i18n/i18n";

const SettingsStack = createNativeStackNavigator();

const MainView = ({navigation}) => {
    const dispatch = useDispatch();

    return (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: Theme.colors.background }}>
            <Button onPress={() => navigation.navigate('Preferences')}>
                { translate('prefBtn')}
            </Button>

            <Button onPress={() => navigation.navigate('Notifications')}>
            { translate('notifBtn')}
            </Button>

            <Button onPress={() => navigation.navigate('Privacy')}>
            { translate('privBtn')}
            </Button>

            <Button onPress={() => navigation.navigate('ChangePassword')}>
                { translate('changepasswdBtn')}
            </Button>

            <Button onPress={() => navigation.navigate('ChangeEmail')}>
            { translate('changeemailBtn')}
            </Button>

            <Button onPress={() => navigation.navigate('GoogleAccount')}>
            { translate('googleacctBtn')}
            </Button>

            <Button onPress={() => dispatch(unsetUserToken())} >
                { translate('signoutBtn')}
            </Button>
        </View>
    )
}

const PreferencesView = ({navigation}) => {
    const dispatch = useDispatch();
    const language: AvailableLanguages = useSelector((state) => state.language.value);

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ textAlign: "center" }}>{ translate('prefBtn')}</Text>

            <Button onPress={() => navigation.navigate('Main')} >{ translate('backBtn') }</Button>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Themes</Text>
                <Picker selectedValue={undefined}
                    style={{ height: 50, width: 150, alignSelf: 'center'}}
                    // onValueChange={(itemValue, itemIndex) => switch themes}
                    >
                    <Picker.Item label={ translate('dark') } value='dark'/>
                    <Picker.Item label={ translate('light') } value='light'/>
                    <Picker.Item label={ translate('system') } value='system'/>
                </Picker>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>{ translate('langBtn') }</Text>
                <Picker selectedValue={language}
                    style={{ height: 50, width: 150, alignSelf: 'center'}}
                    onValueChange={(itemValue: AvailableLanguages, itemIndex) => {
                        let newLanguage = DefaultLanguage;
                        newLanguage = itemValue;
                        dispatch(useLanguage(newLanguage));
                    }}>
                    <Picker.Item label='Français' value='fr'/>
                    <Picker.Item label='English' value='en'/>
                    <Picker.Item label='Italiano' value='it'/>
                    <Picker.Item label='Espanol' value='sp'/>
                </Picker>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>{ translate('diffBtn') }</Text>
                <Picker selectedValue={undefined}
                    style={{ height: 50, width: 150, alignSelf: 'center'}}
                    // onValueChange={(itemValue, itemIndex) => change level}
                    >
                    <Picker.Item label={ translate('easy') } value='easy'/>
                    <Picker.Item label={ translate('medium') } value='medium'/>
                    <Picker.Item label={ translate('hard') } value='hard'/>
                </Picker>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Color blind mode</Text>
                <Switch style={{ alignSelf: 'center'}} thumbColor={Theme.colors.accent}/>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Mic volume</Text>
                <Slider
                    style={{width: 200, height: 40, alignSelf: 'center'}}
                    minimumValue={0}
                    maximumValue={1}
                    minimumTrackTintColor={Theme.colors.primary}
                    maximumTrackTintColor={Theme.colors.disabled}
                    thumbTintColor={Theme.colors.accent}
                />
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Device</Text>
                <Picker selectedValue={undefined}
                    style={{ height: 50, width: 150, alignSelf: 'center'}}
                    // onValueChange={(itemValue, itemIndex) => change device}
                    >
                    <Picker.Item label='Mic_0' value='0'/>
                    <Picker.Item label='Mic_1' value='1'/>
                    <Picker.Item label='Mic_2' value='2'/>
                </Picker>
            </View>
        </View>
    )
}

const NotificationsView = ({navigation}) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>

            <Button onPress={() => navigation.navigate('Main')}>{ translate('backBtn') }</Button>

            <Text style={{ textAlign: "center" }}>{ translate('notifBtn')}</Text>

            <View style={{margin: 20}} >
                <Text style={{ textAlign: "center" }}>Push notifications</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} thumbColor={Theme.colors.accent}/>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Email notifications</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} thumbColor={Theme.colors.accent}/>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Training reminder</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} thumbColor={Theme.colors.accent}/>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>New songs</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} thumbColor={Theme.colors.accent}/>
            </View>
        </View>
    )
}

const PrivacyView = ({navigation}) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button onPress={() => navigation.navigate('Main')}>{ translate('backBtn') }</Button>

            <Text style={{ textAlign: "center" }}>{ translate('privBtn')}</Text>

            <View style={{margin: 20}} >
                <Text style={{ textAlign: "center" }}>Data Collection</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} thumbColor={Theme.colors.accent}/>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Custom Adds</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} thumbColor={Theme.colors.accent}/>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Recommendations</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} thumbColor={Theme.colors.accent}/>
            </View>
        </View>
    )
}

const ChangePasswordView = ({navigation}) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button onPress={() => navigation.navigate('Main')}>Back</Button>
            <Text>ChangePassword</Text>
        </View>
    )
}

const ChangeEmailView = ({navigation}) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button onPress={() => navigation.navigate('Main')}>Back</Button>
            <Text>ChangeEmail</Text>
        </View>
    )
}

const GoogleAccountView = ({navigation}) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button onPress={() => navigation.navigate('Main')}>Back</Button>
            <Text>GoogleAccount</Text>
        </View>
    )
}

const SetttingsNavigator = () => {
    return (
        <SettingsStack.Navigator initialRouteName='Main' screenOptions={{headerShown: false}}>
            <SettingsStack.Screen name='Main' component={MainView} />
            <SettingsStack.Screen name='Preferences' component={PreferencesView} />
            <SettingsStack.Screen name='Notifications' component={NotificationsView} />
            <SettingsStack.Screen name='Privacy' component={PrivacyView} />
            <SettingsStack.Screen name='ChangePassword' component={ChangePasswordView} />
            <SettingsStack.Screen name='ChangeEmail' component={ChangeEmailView} />
            <SettingsStack.Screen name='GoogleAccount' component={GoogleAccountView} />
        </SettingsStack.Navigator>
    )
}

export default SetttingsNavigator;