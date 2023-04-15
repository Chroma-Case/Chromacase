import React from "react";
import { Center, Heading } from "native-base";
import { translate, Translate } from "../../i18n/i18n";
import { useDispatch } from "react-redux";
import { RootState, useSelector } from "../../state/Store";
import { SettingsState, updateSettings } from "../../state/SettingsSlice";
import ElementList from "../../components/GtkUI/ElementList";

const NotificationsView = ({ navigation }) => {
	const dispatch = useDispatch();
	const settings: SettingsState = useSelector(
		(state: RootState) => state.settings.settings as SettingsState
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
							value: settings.enablePushNotifications,
							onToggle: () => {
								dispatch(
									updateSettings({
										enablePushNotifications: !settings.enablePushNotifications,
									})
								);
							},
						},
					},
					{
						type: "toggle",
						title: translate("SettingsNotificationsEmailNotifications"),
						data: {
							value: settings.enableMailNotifications,
							onToggle: () => {
								dispatch(
									updateSettings({
										enableMailNotifications: !settings.enableMailNotifications,
									})
								);
							},
						},
					},
					{
						type: "toggle",
						title: translate("SettingsNotificationsTrainingReminder"),
						data: {
							value: settings.enableLessongsReminders,
							onToggle: () => {
								dispatch(
									updateSettings({
										enableLessongsReminders: !settings.enableLessongsReminders,
									})
								);
							},
						},
					},
					{
						type: "toggle",
						title: translate("SettingsNotificationsReleaseAlert"),
						data: {
							value: settings.enableReleaseAlerts,
							onToggle: () => {
								dispatch(
									updateSettings({
										enableReleaseAlerts: !settings.enableReleaseAlerts,
									})
								);
							},
						},
					},
				]}
			/>
		</Center>
	);
};

export default NotificationsView;
