import React from 'react';
import { Flex } from 'native-base';
import { translate } from '../../i18n/i18n';
import ElementList from '../../components/GtkUI/ElementList';
import useUserSettings from '../../hooks/userSettings';
import { LoadingView } from '../../components/Loading';
import { Calendar1, MonitorMobbile, Send2, Warning2 } from 'iconsax-react-native';
import useColorScheme from '../../hooks/colorScheme';

const NotificationsSettings = () => {
	const { settings, updateSettings } = useUserSettings();
	const colorScheme = useColorScheme();
	const color = colorScheme === 'light' ? '#000' : '#fff';

	if (!settings.data) {
		return <LoadingView />;
	}
	return (
		<ElementList
			style={{ width: '100%' }}
			elements={[
				{
					type: 'toggle',
					icon: <MonitorMobbile size="24" color={color} style={{ minWidth: 24 }} />,
					title: translate('SettingsNotificationsTabPushNotificationsSectionTitle'),
					description: translate(
						'SettingsNotificationsTabPushNotificationsSectionDescription'
					),
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
					icon: <Send2 size="24" color={color} style={{ minWidth: 24 }} />,
					title: translate('SettingsNotificationsTabEmailNotificationsSectionTitle'),
					description: translate(
						'SettingsNotificationsTabEmailNotificationsSectionDescription'
					),
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
					icon: <Calendar1 size="24" color={color} style={{ minWidth: 24 }} />,
					title: translate('SettingsNotificationsTabTrainingReminderSectionTitle'),
					description: translate(
						'SettingsNotificationsTabTrainingReminderSectionDescription'
					),
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
					icon: <Warning2 size="24" color={color} style={{ minWidth: 24 }} />,
					title: translate('SettingsNotificationsTabReleaseAlertSectionTitle'),
					description: translate(
						'SettingsNotificationsTabReleaseAlertSectionDescription'
					),
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
	);
};

export default NotificationsSettings;
