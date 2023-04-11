import React from "react";
import { View } from "react-native";
import { Center, Button, Text, Switch, Heading } from "native-base";
import { translate, Translate } from "../../i18n/i18n";
import { useDispatch } from "react-redux";
import { RootState, useSelector } from "../../state/Store";
import { useLanguage } from "../../state/LanguageSlice";
import { SettingsState, updateSettings } from "../../state/SettingsSlice";
import ElementList from "../../components/GtkUI/ElementList";

const NotificationsView = ({ navigation }) => {
	const dispatch = useDispatch();
	let settings: SettingsState = useSelector(
		(state: RootState) => state.settings
	);
	const [pushNotifications, setPushNotifications] = React.useState(
		settings.enablePushNotifications
	);
	const [emailNotifications, setEmailNotifications] = React.useState(
		settings.enableMailNotifications
	);
	const [trainingReminder, setTrainingReminder] = React.useState(
		settings.enableLessongsReminders
	);
	const [releaseAlert, setReleaseAlert] = React.useState(
		settings.enableReleaseAlerts
	);

	return (
		<Center style={{ flex: 1, justifyContent: "center" }}>
			<Heading style={{ textAlign: "center" }}>
				<Translate translationKey="notifBtn" />
			</Heading>
			<ElementList
				style={{
					marginTop: 20,
					width: "90%",
					maxWidth: 850,
				}}
				elements={[
					{
						type: "toggle",
						title: translate("SettingsNotificationsPushNotifications"),
						data: {
							value: pushNotifications,
							onToggle: () => {
								dispatch(
									updateSettings({
										enablePushNotifications: !settings.enablePushNotifications,
									})
								);
								setPushNotifications(!pushNotifications);
							},
						},
					},
					{
						type: "toggle",
						title: translate("SettingsNotificationsEmailNotifications"),
						data: {
							value: emailNotifications,
							onToggle: () => {
								dispatch(
									updateSettings({
										enableMailNotifications: !settings.enableMailNotifications,
									})
								);
								setEmailNotifications(!emailNotifications);
							},
						},
					},
					{
						type: "toggle",
						title: translate("SettingsNotificationsTrainingReminder"),
						data: {
							value: trainingReminder,
							onToggle: () => {
								dispatch(
									updateSettings({
										enableLessongsReminders: !settings.enableLessongsReminders,
									})
								);
								setTrainingReminder(!trainingReminder);
							},
						},
					},
					{
						type: "toggle",
						title: translate("SettingsNotificationsReleaseAlert"),
						data: {
							value: releaseAlert,
							onToggle: () => {
								dispatch(
									updateSettings({
										enableReleaseAlerts: !settings.enableReleaseAlerts,
									})
								);
								setReleaseAlert(!releaseAlert);
							},
						},
					},
				]}
			/>
		</Center>
	);
};

export default NotificationsView;
