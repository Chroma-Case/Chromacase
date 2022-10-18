import React from 'react';
import { View } from 'react-native';
import { Center, Button, Text, Switch, Slider, Select, Heading } from "native-base";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { unsetUserToken } from '../state/UserSlice';
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "../state/LanguageSlice";
import i18n, { AvailableLanguages, DefaultLanguage, translate } from "../i18n/i18n";

const SettingsStack = createNativeStackNavigator();

const MainView = ({navigation}) => {
    const dispatch = useDispatch();

    return (
        <Center style={{ flex: 1}}>
            <Button variant='ghost' onPress={() => navigation.navigate('Preferences')}>
                { translate('prefBtn')}
            </Button>

            <Button variant='ghost' onPress={() => navigation.navigate('Notifications')}>
            { translate('notifBtn')}
            </Button>

            <Button variant='ghost' onPress={() => navigation.navigate('Privacy')}>
            { translate('privBtn')}
            </Button>

            <Button variant='ghost' onPress={() => navigation.navigate('ChangePassword')}>
                { translate('changepasswdBtn')}
            </Button>

            <Button variant='ghost' onPress={() => navigation.navigate('ChangeEmail')}>
            { translate('changeemailBtn')}
            </Button>

            <Button variant='ghost' onPress={() => navigation.navigate('GoogleAccount')}>
            { translate('googleacctBtn')}
            </Button>

            <Button variant='ghost' onPress={() => dispatch(unsetUserToken())} >
                { translate('signoutBtn')}
            </Button>
        </Center>
    )
}

const PreferencesView = ({navigation}) => {
    const dispatch = useDispatch();
    const language: AvailableLanguages = useSelector((state) => state.language.value);

    return (
        <Center style={{ flex: 1}}>
            <Heading style={{ textAlign: "center" }}>{ translate('prefBtn')}</Heading>

            <Button onPress={() => navigation.navigate('Main')} style={{ margin: 10}}>{ translate('backBtn') }</Button>

            <View style={{margin: 20, maxHeight: 100, maxWidth: 500, width: '80%'}}>
                <Select selectedValue={undefined}
                placeholder={'Theme'}
                    style={{ alignSelf: 'center'}}
                    // onValueChange={(itemValue, itemIndex) => switch themes}
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
                    onValueChange={(itemValue: AvailableLanguages, itemIndex) => {
                        let newLanguage = DefaultLanguage;
                        newLanguage = itemValue;Heading
                        dispatch(useLanguage(newLanguage));
                    }}>
                    <Select.Item label='Français' value='fr'/>
                    <Select.Item label='English' value='en'/>
                    <Select.Item label='Italiano' value='it'/>
                    <Select.Item label='Espanol' value='sp'/>
                </Select>
            </View>

            <View style={{margin: 20, maxHeight: 100, maxWidth: 500, width: '80%'}}>
                <Select selectedValue={undefined}
                    placeholder={ translate('diffBtn') }
                    style={{ height: 50, width: 150, alignSelf: 'center'}}
                    // onValueChange={(itemValue, itemIndex) => change level}
                    >

                    <Select.Item label={ translate('easy') } value='easy'/>
                    <Select.Item label={ translate('medium') } value='medium'/>
                    <Select.Item label={ translate('hard') } value='hard'/>
                </Select>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Color blind mode</Text>
                <Switch style={{ alignSelf: 'center'}} colorScheme="primary"/>
            </View>

            <View style={{margin: 20, maxHeight: 100, maxWidth: 500, width: '80%'}}>
                <Text style={{ textAlign: "center" }}>Mic volume</Text>
                <Slider defaultValue={50} minValue={0} maxValue={1000} accessibilityLabel="hello world" step={10}>
                    <Slider.Track>
                        <Slider.FilledTrack/>
                    </Slider.Track>
                    <Slider.Thumb/>
                </Slider>
            </View>

            <View style={{margin: 20, maxHeight: 100, maxWidth: 500, width: '80%'}}>
                <Select selectedValue={undefined}
                    placeholder={'Device'}
                    style={{ height: 50, width: 150, alignSelf: 'center'}}
                    // onValueChange={(itemValue, itemIndex) => change device}
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
    return (
        <Center style={{ flex: 1, justifyContent: 'center' }}>

            <Heading style={{ textAlign: "center" }}>{ translate('notifBtn')}</Heading>
            <Button style={{ margin: 10}} onPress={() => navigation.navigate('Main')} >{ translate('backBtn') }</Button>

            <View style={{margin: 20}} >
                <Text style={{ textAlign: "center" }}>Push notifications</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"/>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Email notifications</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"/>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Training reminder</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"/>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>New songs</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"/>
            </View>
        </Center>
    )
}

const PrivacyView = ({navigation}) => {
    return (
        <Center style={{ flex: 1}}>
            <Heading style={{ textAlign: "center" }}>{ translate('privBtn')}</Heading>

            <Button onPress={() => navigation.navigate('Main')} style={{ margin: 10 }}>{ translate('backBtn') }</Button>

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