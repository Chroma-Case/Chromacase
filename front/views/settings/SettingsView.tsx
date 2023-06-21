import React, { useMemo } from 'react';
import { Center, Text, Heading, Box } from 'native-base';
import { translate } from '../../i18n/i18n';
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
import { RouteProps } from '../../Navigation';

const handleChangeEmail = async (newEmail: string): Promise<string> => {
	await API.updateUserEmail(newEmail);
	return translate('emailUpdated');
};

const handleChangePassword = async (oldPassword: string, newPassword: string): Promise<string> => {
	await API.updateUserPassword(oldPassword, newPassword);
	return translate('passwordUpdated');
};

export const ChangePasswordView = () => {
	return (
		<Center style={{ flex: 1 }}>
			<Heading paddingBottom={'2%'}>{translate('changePassword')}</Heading>
			<ChangePasswordForm
				onSubmit={(oldPassword, newPassword) =>
					handleChangePassword(oldPassword, newPassword)
				}
			/>
		</Center>
	);
};

export const ChangeEmailView = () => {
	return (
		<Center style={{ flex: 1 }}>
			<Heading paddingBottom={'2%'}>{translate('changeEmail')}</Heading>
			<ChangeEmailForm onSubmit={(oldEmail, newEmail) => handleChangeEmail(newEmail)} />
		</Center>
	);
};

export const GoogleAccountView = () => {
	return (
		<Center style={{ flex: 1 }}>
			<Text>GoogleAccount</Text>
		</Center>
	);
};

export const PianoSettingsView = () => {
	return (
		<Center style={{ flex: 1 }}>
			<Text>Global settings for the virtual piano</Text>
		</Center>
	);
};

const TabRow = createTabRowNavigator();

type SetttingsNavigatorProps = {
	screen?:
		| 'profile'
		| 'preferences'
		| 'notifications'
		| 'privacy'
		| 'changePassword'
		| 'changeEmail'
		| 'googleAccount'
		| 'pianoSettings';
};

const SetttingsNavigator = (props?: RouteProps<SetttingsNavigatorProps>) => {
	const userQuery = useQuery(['user'], () => API.getUserInfo());
	const user = useMemo(() => userQuery.data, [userQuery]);
	console.log(props?.screen);
	if (userQuery.isLoading) {
		return (
			<Center style={{ flex: 1 }}>
				<Text>Loading...</Text>
			</Center>
		);
	}

	return (
		<TabRow.Navigator
			initialRouteName={props?.screen ?? 'InternalDefault'}
			contentStyle={{}}
			tabBarStyle={{}}
		>
			{/* I'm doing this to be able to land on the summary of settings when clicking on settings and directly to the
			wanted settings page if needed so I need to do special work with the 0 index */}
			<TabRow.Screen name="InternalDefault" component={Box} />
			{user && user.isGuest && (
				<TabRow.Screen
					name="guestToUser"
					component={GuestToUserView}
					options={{
						title: translate('SettingsCategoryGuest'),
						iconProvider: FontAwesome5,
						iconName: 'user-clock',
					}}
				/>
			)}
			<TabRow.Screen
				name="profile"
				component={ProfileSettings}
				options={{
					title: translate('SettingsCategoryProfile'),
					iconProvider: FontAwesome5,
					iconName: 'user',
				}}
			/>
			<TabRow.Screen
				name="preferences"
				component={PreferencesView}
				options={{
					title: translate('SettingsCategoryPreferences'),
					iconProvider: FontAwesome5,
					iconName: 'music',
				}}
			/>
			<TabRow.Screen
				name="notifications"
				component={NotificationsView}
				options={{
					title: translate('SettingsCategoryNotifications'),
					iconProvider: FontAwesome5,
					iconName: 'bell',
				}}
			/>
			<TabRow.Screen
				name="privacy"
				component={PrivacyView}
				options={{
					title: translate('SettingsCategoryPrivacy'),
					iconProvider: FontAwesome5,
					iconName: 'lock',
				}}
			/>
			<TabRow.Screen
				name="changePassword"
				component={ChangePasswordView}
				options={{
					title: translate('SettingsCategorySecurity'),
					iconProvider: FontAwesome5,
					iconName: 'key',
				}}
			/>
			<TabRow.Screen
				name="changeEmail"
				component={ChangeEmailView}
				options={{
					title: translate('SettingsCategoryEmail'),
					iconProvider: FontAwesome5,
					iconName: 'envelope',
				}}
			/>
			<TabRow.Screen
				name="googleAccount"
				component={GoogleAccountView}
				options={{
					title: translate('SettingsCategoryGoogle'),
					iconProvider: FontAwesome5,
					iconName: 'google',
				}}
			/>
			<TabRow.Screen
				name="pianoSettings"
				component={PianoSettingsView}
				options={{
					title: translate('SettingsCategoryPiano'),
					iconProvider: MaterialCommunityIcons,
					iconName: 'piano',
				}}
			/>
		</TabRow.Navigator>
	);
};

export default SetttingsNavigator;
