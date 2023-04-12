import React from 'react';
import { View } from 'react-native';
import { Center, Button, Text, Switch, Slider, Select, Heading, Box } from "native-base";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { unsetAccessToken } from '../../state/UserSlice';
import { useDispatch } from "react-redux";
import { RootState, useSelector } from '../../state/Store';
import { useLanguage } from "../../state/LanguageSlice";
import { SettingsState, updateSettings } from '../../state/SettingsSlice';
import { AvailableLanguages, translate, Translate } from "../../i18n/i18n";
import TextButton from '../../components/TextButton';
import createTabRowNavigator from '../../components/navigators/TabRowNavigator';
import { FontAwesome, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import ChangePasswordForm from '../../components/forms/changePasswordForm';
import ChangeEmailForm from '../../components/forms/changeEmailForm';
import ProfileSettings from './SettingsProfileView';

import API, { APIError } from '../../API';


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

export const PreferencesView = ({navigation}) => {
	const dispatch = useDispatch();
	const language: AvailableLanguages = useSelector((state: RootState) => state.language.value);
	const settings = useSelector((state: RootState) => (state.settings.settings as SettingsState));
	return (
		<Center style={{ flex: 1}}>
			<Heading style={{ textAlign: "center" }}>
				<Translate translationKey='prefBtn'/>
			</Heading>
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
				<Text style={{ textAlign: 'center' }}>Color blind mode</Text>
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

export const PrivacyView = ({navigation}) => {
	return (
		<Center style={{ flex: 1}}>
			<Heading style={{ textAlign: "center" }}>
				<Translate translationKey='privBtn'/>
			</Heading>

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