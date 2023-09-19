import React from 'react';
import { Center, Flex, Heading } from 'native-base';
import { translate, Translate } from '../../i18n/i18n';
import ElementList from '../../components/GtkUI/ElementList';
import useUserSettings from '../../hooks/userSettings';
import { LoadingView } from '../../components/Loading';
import { Calendar1, MonitorMobbile, Send2, Warning2 } from 'iconsax-react-native';

const NotificationsView = () => {
	const { settings, updateSettings } = useUserSettings();

	if (!settings.data) {
		return <LoadingView />;
	}
	return (
		<Flex
			style={{
				flex: 1,
				alignItems: 'center',
				paddingTop: 32,
			}}
		>
			<ElementList
				style={{
					marginTop: 20,
					width: '90%',
					maxWidth: 850,
				}}
				elements={[
					{
						type: 'toggle',
						icon: <MonitorMobbile size="24" color="#FFF" style={{minWidth: 24}}/>,
						title: translate('SettingsNotificationsPushNotifications'),
						description: 'Cette notification apparaitra sur votre apparail en pop-up',
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
						icon: <Send2 size="24" color="#FFF" style={{minWidth: 24}}/>,
						title: translate('SettingsNotificationsEmailNotifications'),
						description: 'Recevez des mails pour atteindre vos objectifs',
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
						icon: <Calendar1 size="24" color="#FFF" style={{minWidth: 24}}/>,
						title: translate('SettingsNotificationsTrainingReminder'),
						description: 'Un apprentissage régulier est la clé',
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
						icon: <Warning2 size="24" color="#FFF" style={{minWidth: 24}}/>,
						title: translate('SettingsNotificationsReleaseAlert'),
						description: 'Restez informé de nos mises à jour',
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
		</Flex>
	);
};

export default NotificationsView;
