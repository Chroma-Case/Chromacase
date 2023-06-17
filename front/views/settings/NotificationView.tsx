import React from 'react';
import { Center, Heading } from 'native-base';
import { translate, Translate } from '../../i18n/i18n';
import ElementList from '../../components/GtkUI/ElementList';
import useUserSettings from '../../hooks/userSettings';
import { LoadingView } from '../../components/Loading';

const NotificationsView = () => {
	const { settings, updateSettings } = useUserSettings();

	if (!settings.data) {
		return <LoadingView />;
	}
	return (
		<Center style={{ flex: 1, justifyContent: 'center' }}>
			<Heading style={{ textAlign: 'center' }}>
				<Translate translationKey="notifBtn" />
			</Heading>
			<ElementList
				style={{
					marginTop: 20,
					width: '90%',
					maxWidth: 850,
				}}
				elements={[
					{
						type: 'toggle',
						title: translate('SettingsNotificationsPushNotifications'),
						data: {
							value: settings.data.notifications.pushNotif,
							onToggle: () => {
								updateSettings({
									notifications: {
										pushNotif: !settings.data.notifications.pushNotif,
									},
								});
							},
						},
					},
					{
						type: 'toggle',
						title: translate('SettingsNotificationsEmailNotifications'),
						data: {
							value: settings.data.notifications.emailNotif,
							onToggle: () => {
								updateSettings({
									notifications: {
										emailNotif: !settings.data.notifications.emailNotif,
									},
								});
							},
						},
					},
					{
						type: 'toggle',
						title: translate('SettingsNotificationsTrainingReminder'),
						data: {
							value: settings.data.notifications.trainNotif,
							onToggle: () => {
								updateSettings({
									notifications: {
										trainNotif: !settings.data.notifications.trainNotif,
									},
								});
							},
						},
					},
					{
						type: 'toggle',
						title: translate('SettingsNotificationsReleaseAlert'),
						data: {
							value: settings.data.notifications.newSongNotif,
							onToggle: () => {
								updateSettings({
									notifications: {
										newSongNotif: !settings.data.notifications.newSongNotif,
									},
								});
							},
						},
					},
				]}
			/>
		</Center>
	);
};

export default NotificationsView;
