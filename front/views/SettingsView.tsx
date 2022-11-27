import React from 'react';
import { View } from 'react-native';
import { Center, Button, Text, Switch, Slider, Select, Heading } from "native-base";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { unsetAccessToken } from '../state/UserSlice';
import { useDispatch } from "react-redux";
import { RootState, useSelector } from '../state/Store';
import { useLanguage } from "../state/LanguageSlice";
import { SettingsState, updateSettings } from '../state/SettingsSlice';
import { AvailableLanguages, translate, Translate } from "../i18n/i18n";

const SettingsStack = createNativeStackNavigator();

const MainView = ({navigation}) => {
    const dispatch = useDispatch();

    return (
        <Center style={{ flex: 1}}>
            <Button variant='ghost' onPress={() => navigation.navigate('Preferences')}>
                <Translate translationKey='prefBtn'/>
            </Button>

            <Button variant='ghost' onPress={() => navigation.navigate('Notifications')}>
                <Translate translationKey='notifBtn'/>
            </Button>

            <Button variant='ghost' onPress={() => navigation.navigate('Privacy')}>
                <Translate translationKey='privBtn'/>
            </Button>

            <Button variant='ghost' onPress={() => navigation.navigate('ChangePassword')}>
                <Translate translationKey='changepasswdBtn'/>
            </Button>

            <Button variant='ghost' onPress={() => navigation.navigate('ChangeEmail')}>
                <Translate translationKey='changeemailBtn'/>
            </Button>

            <Button variant='ghost' onPress={() => navigation.navigate('GoogleAccount')}>
                <Translate translationKey='googleacctBtn'/>
            </Button>

            <Button variant='ghost' onPress={() => dispatch(unsetAccessToken())} >
                <Translate translationKey='signoutBtn'/>
            </Button>
        </Center>
    )
}

const PreferencesView = ({navigation}) => {
    const dispatch = useDispatch();
    const language: AvailableLanguages = useSelector((state: RootState) => state.language.value);
    const settings = useSelector((state: RootState) => (state.settings.settings as SettingsState));
    return (
        <Center style={{ flex: 1}}>
            <Heading style={{ textAlign: "center" }}>
                <Translate translationKey='prefBtn'/>
            </Heading>
            <Button onPress={() => navigation.navigate('Main')} style={{ margin: 10}}>
                <Translate translationKey='backBtn'/>
            </Button>

            <View style={{margin: 20, maxHeight: 100, maxWidth: 500, width: '80%'}}>
                <Select selectedValue={settings.colorScheme}
                    placeholder={'Theme'}
                    style={{ alignSelf: 'center'}}
                    onValueChange={(newColorScheme) => {
                        dispatch(updateSettings({ colorScheme: newColorScheme as any }))
                    }}
                >
                    <Select.Item label={ translate('dark') } value='dark'/>
                    <Select.Item label={ translate('light') } value='light'/>
                    <Select.Item label={ translate('system') } value='system'/>
                </Select>
            </View>

            <View style={{margin: 20, maxHeight: 100, maxWidth: 500, width: '80%'}}>
                <Select selectedValue={language}
                    placeholder={translate('langBtn')} 
                    style={{ alignSelf: 'center'}}
                    onValueChange={(itemValue) => {
                        dispatch(useLanguage(itemValue as AvailableLanguages));
                    }}>
                    <Select.Item label='Français' value='fr'/>
                    <Select.Item label='English' value='en'/>
                    <Select.Item label='Italiano' value='it'/>
                    <Select.Item label='Espanol' value='sp'/>
                </Select>
            </View>

            <View style={{margin: 20, maxHeight: 100, maxWidth: 500, width: '80%'}}>
                <Select selectedValue={settings.preferedLevel}
                    placeholder={ translate('diffBtn') }
                    style={{ height: 50, width: 150, alignSelf: 'center'}}
                    onValueChange={(itemValue) => {
                        dispatch(updateSettings({ preferedLevel: itemValue as any }));
                    }}>
                    <Select.Item label={ translate('easy') } value='easy'/>
                    <Select.Item label={ translate('medium') } value='medium'/>
                    <Select.Item label={ translate('hard') } value='hard'/>
                </Select>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Color blind mode</Text>
                <Switch style={{ alignSelf: 'center'}} value={settings.colorBlind} colorScheme="primary"
                    onValueChange={(enabled) => { dispatch(updateSettings({ colorBlind: enabled })) }}
                />
            </View>

            <View style={{margin: 20, maxHeight: 100, maxWidth: 500, width: '80%'}}>
                <Text style={{ textAlign: "center" }}>Mic volume</Text>
                <Slider defaultValue={settings.micLevel} minValue={0} maxValue={1000} accessibilityLabel="hello world" step={10}
                    onChangeEnd={(value) => { dispatch(updateSettings({ micLevel: value })) }}
                >
                    <Slider.Track>
                        <Slider.FilledTrack/>
                    </Slider.Track>
                    <Slider.Thumb/>
                </Slider>
            </View>

            <View style={{margin: 20, maxHeight: 100, maxWidth: 500, width: '80%'}}>
                <Select selectedValue={settings.preferedInputName}
                    placeholder={'Device'}
                    style={{ height: 50, width: 150, alignSelf: 'center'}}
                    onValueChange={(itemValue: string) => { dispatch(updateSettings({ preferedInputName: itemValue })) }}
                >
                    <Select.Item label='Mic_0' value='0'/>
                    <Select.Item label='Mic_1' value='1'/>
                    <Select.Item label='Mic_2' value='2'/>
                </Select>
            </View>
        </Center>
    )
}

const NotificationsView = ({navigation}) => {
    const dispatch = useDispatch();
    const settings: SettingsState = useSelector((state: RootState) => state.settings);
    return (
        <Center style={{ flex: 1, justifyContent: 'center' }}>

            <Heading style={{ textAlign: "center" }}>
                <Translate translationKey='notifBtn'/>
            </Heading>
            <Button style={{ margin: 10}} onPress={() => navigation.navigate('Main')} >
                <Translate translationKey='backBtn'/>
            </Button>
            <View style={{margin: 20}} >
                <Text style={{ textAlign: "center" }}>Push notifications</Text>
                <Switch value={settings.enablePushNotifications} style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"
                    onValueChange={(value) => { dispatch(updateSettings({ enablePushNotifications: value })) }}
                />
            </View>
            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Email notifications</Text>
                <Switch value={settings.enableMailNotifications} style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"
                    onValueChange={(value) => { dispatch(updateSettings({ enableMailNotifications: value })) }}
                />
            </View>
            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Training reminder</Text>
                <Switch value={settings.enableLessongsReminders} style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"
                    onValueChange={(value) => { dispatch(updateSettings({ enableLessongsReminders: value })) }}
                />
            </View>
            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>New songs</Text>
                <Switch value={settings.enableReleaseAlerts} style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"
                    onValueChange={(value) => { dispatch(updateSettings({ enableReleaseAlerts: value })) }}
                />
            </View>
        </Center>
    )
}

const PrivacyView = ({navigation}) => {
    return (
        <Center style={{ flex: 1}}>
            <Heading style={{ textAlign: "center" }}>
                <Translate translationKey='privBtn'/>
            </Heading>

            <Button onPress={() => navigation.navigate('Main')} style={{ margin: 10 }}>
                <Translate translationKey='backBtn'/>
            </Button>

            <View style={{margin: 20}} >
                <Text style={{ textAlign: "center" }}>Data Collection</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"/>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Custom Adds</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"/>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Recommendations</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"/>
            </View>
        </Center>
    )
}

const ChangePasswordView = ({navigation}) => {
    return (
        <Center style={{ flex: 1}}>
            <Button onPress={() => navigation.navigate('Main')}>Back</Button>
            <Text>ChangePassword</Text>
        </Center>
    )
}

const ChangeEmailView = ({navigation}) => {
    return (
        <Center style={{ flex: 1}}>
            <Button onPress={() => navigation.navigate('Main')}>Back</Button>
            <Text>ChangeEmail</Text>
        </Center>
    )
}

const GoogleAccountView = ({navigation}) => {
    return (
        <Center style={{ flex: 1}}>
            <Button onPress={() => navigation.navigate('Main')}>Back</Button>
            <Text>GoogleAccount</Text>
        </Center>
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