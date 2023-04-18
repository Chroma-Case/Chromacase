import React from 'react';
import createTabRowNavigator from '../../components/navigators/TabRowNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChangePasswordForm from '../../components/forms/changePasswordForm';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import ChangeEmailForm from '../../components/forms/changeEmailForm';
import { Box } from "native-base";
import ProfileSettings from './SettingsProfileView';
import NotificationsView from './NotificationView';
import API, { APIError } from '../../API';
import PrivacyView from './PrivacyView';
import { SettingsState, updateSettings } from '../../state/SettingsSlice';

import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Center, Button, Text, Switch, Slider, Select, Heading } from "native-base";
import { useLanguage } from "../../state/LanguageSlice";
import i18n, { AvailableLanguages, DefaultLanguage, Translate, translate } from "../../i18n/i18n";
import { RootState } from '../../state/Store';
import PreferencesView from './PreferencesView';

const SettingsStack = createNativeStackNavigator();

const handleChangeEmail = async (newEmail: string): Promise<string> => {
	try {
		let response = await API.updateUserEmail(newEmail);
		return translate('emailUpdated');
	} catch (e) {
		throw e;
	}
}

const handleChangePassword = async (oldPassword: string, newPassword: string): Promise<string> => {
	try {
		let response = await API.updateUserPassword(oldPassword, newPassword);
		return translate('passwordUpdated');
	} catch (e) {
		throw e;
	}
}

export const ChangePasswordView = ({navigation}: any) => {
	return (
		<Center style={{ flex: 1}}>
			<Heading paddingBottom={'2%'}>{translate('changePassword')}</Heading>
			<ChangePasswordForm onSubmit={(oldPassword, newPassword) => handleChangePassword(oldPassword, newPassword)}/>
		</Center>
	)
}

export const ChangeEmailView = ({navigation}: any) => {
	return (
		<Center style={{ flex: 1}}>
            <Heading paddingBottom={'2%'}>{translate('changeEmail')}</Heading>
            <ChangeEmailForm onSubmit={(oldEmail, newEmail) => handleChangeEmail(newEmail)}/>
        </Center>
	)
}

export const GoogleAccountView = ({navigation}: any) => {
	return (
		<Center style={{ flex: 1}}>
			<Text>GoogleAccount</Text>
		</Center>
	)
}

export const PianoSettingsView = ({navigation}: any) => {
	return (
		<Center style={{ flex: 1}}>
			<Text>Global settings for the virtual piano</Text>
		</Center>
	)
}

const TabRow = createTabRowNavigator(); 

const SetttingsNavigator = () => {
	return (
		<TabRow.Navigator initialRouteName='InternalDefault'>
			{/* I'm doing this to be able to land on the summary of settings when clicking on settings and directly to the
			wanted settings page if needed so I need to do special work with the 0 index */}
			<TabRow.Screen name='InternalDefault' component={Box} />
			<TabRow.Screen name='Profile' component={ProfileSettings} options={{ 
				title: translate('SettingsCategoryProfile'),
				iconProvider: FontAwesome5,
				iconName: "user"
			}} />
			<TabRow.Screen name='Preferences' component={PreferencesView} options={{
				title: translate('SettingsCategoryPreferences'),
				iconProvider: FontAwesome5,
				iconName: "music"
			}} />
			<TabRow.Screen name='Notifications' component={NotificationsView} options={{
				title: translate('SettingsCategoryNotifications'),
				iconProvider: FontAwesome5,
				iconName: "bell"
			}}/>
			<TabRow.Screen name='Privacy' component={PrivacyView} options={{
				title: translate('SettingsCategoryPrivacy'),
				iconProvider: FontAwesome5,
				iconName: "lock"
			}} />
			<TabRow.Screen name='ChangePassword' component={ChangePasswordView} options={{
				title: translate('SettingsCategorySecurity'),
				iconProvider: FontAwesome5,
				iconName: "key"
			}}/>
			<TabRow.Screen name='ChangeEmail' component={ChangeEmailView} options={{
				title: translate('SettingsCategoryEmail'),
				iconProvider: FontAwesome5,
				iconName: "envelope"
			}} />
			<TabRow.Screen name='GoogleAccount' component={GoogleAccountView} options={{
				title: translate('SettingsCategoryGoogle'),
				iconProvider: FontAwesome5,
				iconName: "google"
			}} />
			<TabRow.Screen name='PianoSettings' component={PianoSettingsView} options={{
				title: translate('SettingsCategoryPiano'),
				iconProvider: MaterialCommunityIcons,
				iconName: "piano"
			}} />
		</TabRow.Navigator>
	)
}

export default SetttingsNavigator;