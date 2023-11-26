import API from '../../API';
import React from 'react';
import { Column, Toast } from 'native-base';
import { LoadingView } from '../../components/Loading';
import ElementList from '../../components/GtkUI/ElementList';
import { translate } from '../../i18n/i18n';
import { useQuery } from '../../Queries';
import * as ImagePicker from 'expo-image-picker';
import { Google, PasswordCheck, SmsEdit, UserSquare, Verify } from 'iconsax-react-native';
import ChangeEmailForm from '../../components/forms/changeEmailForm';
import ChangePasswordForm from '../../components/forms/changePasswordForm';
import LogoutButtonCC from '../../components/UI/LogoutButtonCC';
import { ScrollView } from 'react-native';

const handleChangeEmail = async (newEmail: string): Promise<string> => {
	await API.updateUserEmail(newEmail);
	return translate('emailUpdated');
};

const handleChangePassword = async (oldPassword: string, newPassword: string): Promise<string> => {
	await API.updateUserPassword(oldPassword, newPassword);
	return translate('passwordUpdated');
};

// Too painful to infer the settings-only, typed navigator. Gave up
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProfileSettings = () => {
	const userQuery = useQuery(API.getUserInfo);

	if (!userQuery.data || userQuery.isLoading) {
		return <LoadingView />;
	}
	const user = userQuery.data;

	return (
		<ScrollView>
			<Column space={4} style={{ width: '100%' }}>
				<ElementList
					elements={[
						{
							icon: Google,
							type: 'text',
							title: translate('settingsProfileTabGoogleSectionTitle'),
							description: translate('settingsProfileTabGoogleSectionDescription'),
							data: {
								text: translate(
									user.googleID
										? 'settingsProfileTabGoogleSectionLinkedText'
										: 'settingsProfileTabGoogleSectionNotLinkedText'
								),
							},
						},
						{
							icon: Verify,
							type: 'text',
							title: translate('settingsProfileTabVerifiedSectionTitle'),
							description: translate('settingsProfileTabVerifiedSectionDescription'),
							data: {
								text: translate(
									user.emailVerified
										? 'settingsProfileTabVerifiedSectionVerifiedText'
										: 'settingsProfileTabVerifiedSectionNotVerifiedText'
								),
								onPress: user.emailVerified
									? undefined
									: () =>
											API.fetch({ route: '/auth/reverify', method: 'PUT' })
												.then(() =>
													Toast.show({
														description: translate(
															'settingsProfileTabVerifiedSectionVerificationToast'
														),
													})
												)
												.catch((e) => {
													console.error(e);
													Toast.show({
														description: translate(
															'settingsProfileTabVerifiedSectionVerificationToastError'
														),
													});
												}),
							},
						},
						{
							icon: UserSquare,
							type: 'text',
							title: translate('settingsProfileTabAvatarSectionTitle'),
							description: translate('settingsProfileTabAvatarSectionDescription'),
							data: {
								text: translate('settingsProfileTabAvatarSectionChangeItText'),
								onPress: () => {
									ImagePicker.launchImageLibraryAsync({
										mediaTypes: ImagePicker.MediaTypeOptions.Images,
										aspect: [1, 1],
										quality: 1,
										base64: true,
									}).then((result) => {
										console.log(result);
										const image = result.assets?.at(0);

										if (!result.canceled && image) {
											API.updateProfileAvatar(image)
												.then(() => {
													userQuery.refetch();
													Toast.show({
														description: translate(
															'settingsProfileTabAvatarSectionUpdateToast'
														),
													});
												})
												.catch((e) => {
													console.error(e);
													Toast.show({
														description: translate(
															'settingsProfileTabAvatarSectionUpdateToastError'
														),
													});
												});
										}
									});
								},
							},
						},
						{
							icon: SmsEdit,
							type: 'sectionDropdown',
							title: translate('settingsProfileTabChangeEmailSectionTitle'),
							description: translate(
								'settingsProfileTabChangeEmailSectionDescription'
							),
							data: {
								value: true,
								section: [
									<ChangeEmailForm
										key={'ChangeEmailForm'}
										onSubmit={(oldEmail, newEmail) =>
											handleChangeEmail(newEmail)
										}
									/>,
								],
							},
						},
						{
							icon: PasswordCheck,
							type: 'sectionDropdown',
							title: translate('settingsProfileTabChangePasswordSectionTitle'),
							description: translate(
								'settingsProfileTabChangePasswordSectionDescription'
							),
							data: {
								value: true,
								section: [
									<ChangePasswordForm
										key={'ChangePasswordForm'}
										onSubmit={(oldPassword, newPassword) =>
											handleChangePassword(oldPassword, newPassword)
										}
									/>,
								],
							},
						},
					]}
				/>
				<LogoutButtonCC isGuest={user.isGuest} buttonType={'filled'} />
			</Column>
		</ScrollView>
	);
};

export default ProfileSettings;
