import React from "react";
import { Text, View, TouchableOpacity, Switch } from 'react-native';
//import { Picker } from '@react-native-picker/picker';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from "react-redux";
import { unsetUserToken } from "../state/UserSlice";
import { Button } from "react-native-paper";
import Theme from "../Theme"

const SettingsStack = createNativeStackNavigator();

const MainView = ({navigation}) => {
    const dispatch = useDispatch();

    return (
        <View style={{ flex: 1, justifyContent: 'center', goBackgroundColor: Theme.colors.goBackground }}>
            <Text >Main settings view</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Preferences')}>
                <Text style={{ textAlign: 'center' }}>Preference</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                <Text style={{ textAlign: 'center' }}>Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
                <Text style={{ textAlign: 'center' }}>Privacy</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')}>
                <Text style={{ textAlign: 'center' }}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ChangeEmail')}>
                <Text style={{ textAlign: 'center' }}>Change Email</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('GoogleAccount')}>
                <Text style={{ textAlign: 'center' }}>Google Account</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => dispatch(unsetUserToken())}>
                <Text style={{ textAlign: 'center' }}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

const PreferencesView = ({navigation}) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>Preferences</Text>
            <Button onPress={() => navigation.navigate('Main')}>Back</Button>
            {/* <View>
                <Picker selectedValue={undefined}
                    style={{ height: 50, width: 150}}
                    // onValueChange={(itemValue, itemIndex) => changeLang(itemValue)}
                    >
                    <Picker.Item label="Dark" value="dark"/>
                    <Picker.Item label="Light" value="light"/>
                    <Picker.Item label="System" value="system"/>
                </Picker>
            </View>

            <Picker selectedValue={undefined}
                style={{ height: 50, width: 150}}
                // onValueChange={(itemValue, itemIndex) => changeLang(itemValue)}
                >
                <Picker.Item label="Français" value="dark"/>
                <Picker.Item label="English" value="light"/>
                <Picker.Item label="Italiano" value="system"/>
                <Picker.Item label="Espanol" value="system"/>
            </Picker> */}

            <View>
                <Text>Color blind mode</Text>
                <Switch>
                </Switch>
            </View>
        </View>
    )
}

const NotificationsView = ({navigation}) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button onPress={() => navigation.navigate('Main')}>Back</Button>
            <Text>Notifications</Text>
        </View>
    )
}

const PrivacyView = ({navigation}) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button onPress={() => navigation.navigate('Main')}>Back</Button>
            <Text>Privacy</Text>
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
        <SettingsStack.Navigator initialRouteName="Main" screenOptions={{headerShown: false}}>
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