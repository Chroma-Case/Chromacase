import React from 'react';
import { Center, Button, Text, Heading } from "native-base";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { unsetUserToken } from '../../state/UserSlice';
import { useDispatch } from "react-redux";
import { translate } from "../../i18n/i18n";
import API from '../../API';
import PreferencesView from './PreferencesView';
import NotificationsView from './NotificationView';
import PrivacyView from './PrivacyView';
import ChangePasswordForm from '../../components/forms/changePasswordForm';

const SettingsStack = createNativeStackNavigator();

const handleChangeEmail = async (newEmail: string): Promise<string> => {
    try {
        let response = await API.updateUserCredentials("email", newEmail);
        return response as string;
    } catch (error) {
        return ("error: " + error);
    }
}

const handleChangePassword = async (oldPassword: string, newPassword: string): Promise<string> => {
    try {
        let response = await API.updateUserCredentials("password", newPassword);
        return response as string;
    } catch (error) {
        return ("error: " + error);
    }
}

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

const ChangePasswordView = ({navigation}) => {
    return (
        <Center style={{ flex: 1}}>
            <Heading paddingBottom={'2%'}>{translate('changePassword')}</Heading>
            <ChangePasswordForm onSubmit={(oldPassword, newPassword) => handleChangePassword(oldPassword, newPassword)}/>
            <Button paddingTop={'2%'} variant='outline' onPress={() => navigation.navigate('Settings')}>Back</Button>
        </Center>
    )
}

const ChangeEmailView = ({navigation}) => {
    return (
        <Center style={{ flex: 1}}>
            <Button variant='outline' onPress={() => navigation.navigate('Settings')}>Back</Button>
            <Text>ChangeEmail</Text>
        </Center>
    )
}

const GoogleAccountView = ({navigation}) => {
    return (
        <Center style={{ flex: 1}}>
            <Button variant='outline' onPress={() => navigation.navigate('Settings')}>Back</Button>
            <Text>GoogleAccount</Text>
        </Center>
    )
}

const SetttingsNavigator = () => {
    return (
        <SettingsStack.Navigator initialRouteName='Settings' screenOptions={{headerShown: false}}>
            <SettingsStack.Screen name='Settings' component={MainView} />
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