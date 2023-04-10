import React from "react";
import { View } from "react-native";
import { Center, Button, Text, Switch, Heading } from "native-base";
import { translate, Translate } from "../../i18n/i18n";
import { useDispatch } from "react-redux";
import { RootState, useSelector } from "../../state/Store";
import { useLanguage } from "../../state/LanguageSlice";
import { SettingsState, updateSettings } from '../../state/SettingsSlice';

const NotificationsView = ({ navigation }) => {
	const dispatch = useDispatch();
	const settings: SettingsState = useSelector(
		(state: RootState) => state.settings
	);
	return (
		<Center style={{ flex: 1, justifyContent: "center" }}>
			<Heading style={{ textAlign: "center" }}>
				<Translate translationKey="notifBtn" />
			</Heading>
			<View style={{ margin: 20 }}>
				<Text style={{ textAlign: "center" }}>Push notifications</Text>
				<Switch
					value={settings.enablePushNotifications}
					style={{ alignSelf: "center", margin: 10 }}
					colorScheme="primary"
					onValueChange={(value) => {
						dispatch(updateSettings({ enablePushNotifications: value }));
					}}
				/>
			</View>
			<View style={{ margin: 20 }}>
				<Text style={{ textAlign: "center" }}>Email notifications</Text>
				<Switch
					value={settings.enableMailNotifications}
					style={{ alignSelf: "center", margin: 10 }}
					colorScheme="primary"
					onValueChange={(value) => {
						dispatch(updateSettings({ enableMailNotifications: value }));
					}}
				/>
			</View>
			<View style={{ margin: 20 }}>
				<Text style={{ textAlign: "center" }}>Training reminder</Text>
				<Switch
					value={settings.enableLessongsReminders}
					style={{ alignSelf: "center", margin: 10 }}
					colorScheme="primary"
					onValueChange={(value) => {
						dispatch(updateSettings({ enableLessongsReminders: value }));
					}}
				/>
			</View>
			<View style={{ margin: 20 }}>
				<Text style={{ textAlign: "center" }}>New songs</Text>
				<Switch
					value={settings.enableReleaseAlerts}
					style={{ alignSelf: "center", margin: 10 }}
					colorScheme="primary"
					onValueChange={(value) => {
						dispatch(updateSettings({ enableReleaseAlerts: value }));
					}}
				/>
			</View>
		</Center>
	);
};

export default NotificationsView;
