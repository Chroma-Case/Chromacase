import React from 'react';
import { Center, Button, Text, Heading, Box } from "native-base";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { unsetAccessToken } from '../../state/UserSlice';
import { useDispatch } from "react-redux";
import { translate, Translate } from "../../i18n/i18n";
import createTabRowNavigator from '../../components/navigators/TabRowNavigator';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import ChangePasswordForm from '../../components/forms/changePasswordForm';
import ChangeEmailForm from '../../components/forms/changeEmailForm';
import ProfileSettings from './SettingsProfileView';
import NotificationsView from './NotificationView';
import PrivacyView from './PrivacyView';
import PreferencesView from './PreferencesView';
import GuestToUserView from './GuestToUserView';
import { useQuery } from 'react-query';
import API from '../../API';


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
				<Translate translationKey='signOutBtn'/>
			</Button>
		</Center>
	)
}

export const ChangePasswordView = ({navigation}) => {
	return (
		<Center style={{ flex: 1}}>
			<Heading paddingBottom={'2%'}>{translate('changePassword')}</Heading>
			<ChangePasswordForm onSubmit={(oldPassword, newPassword) => handleChangePassword(oldPassword, newPassword)}/>
		</Center>
	)
}

export const ChangeEmailView = ({navigation}) => {
	return (
		<Center style={{ flex: 1}}>
            <Heading paddingBottom={'2%'}>{translate('changeEmail')}</Heading>
            <ChangeEmailForm onSubmit={(oldEmail, newEmail) => handleChangeEmail(newEmail)}/>
        </Center>
	)
}

export const GoogleAccountView = ({navigation}) => {
	return (
		<Center style={{ flex: 1}}>
			<Text>GoogleAccount</Text>
		</Center>
	)
}

export const PianoSettingsView = ({navigation}) => {
	return (
		<Center style={{ flex: 1}}>
			<Text>Global settings for the virtual piano</Text>
		</Center>
	)
}

const TabRow = createTabRowNavigator(); 

const SetttingsNavigator = () => {
	const userQuery = useQuery(['user'], () => API.getUserInfo());
	const user = userQuery.data;

	if (userQuery.isError) {
		user.isGuest = false;
	}

	if (userQuery.isLoading) {
		return (
			<Center style={{ flex: 1}}>
				<Text>Loading...</Text>
			</Center>
		)
	}

	return (
		<TabRow.Navigator initialRouteName='InternalDefault'>
			{/* I'm doing this to be able to land on the summary of settings when clicking on settings and directly to the
			wanted settings page if needed so I need to do special work with the 0 index */}
			<TabRow.Screen name='InternalDefault' component={Box} />
			{user && user.isGuest &&
				<TabRow.Screen name='GuestToUser' component={GuestToUserView} options={{
					title: translate('SettingsCategoryGuest'),
					iconProvider: FontAwesome5,
					iconName: "user-clock"
				}} />
			}
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