import API from '../../API';
import React from 'react';
import { Flex, Toast } from 'native-base';
import { LoadingView } from '../../components/Loading';
import ElementList from '../../components/GtkUI/ElementList';
import { translate } from '../../i18n/i18n';
import { useQuery } from '../../Queries';
import * as ImagePicker from 'expo-image-picker';
import { Google, PasswordCheck, SmsEdit, UserSquare, Verify } from 'iconsax-react-native';
import ChangeEmailForm from '../../components/forms/changeEmailForm';
import ChangePasswordForm from '../../components/forms/changePasswordForm';

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
					width: '100%',
					maxWidth: 850,
				}}
				elements={[
					{
						icon: <Google size="24" color="#FFF" style={{ minWidth: 24 }} />,
						type: 'text',
						title: 'Google account', // TODO translate
						description: 'Liez votre compte Google à ChromaCase', // TODO translate
						data: {
							text: user.googleID ? 'Linked' : 'Not linked',
						},
					},
					{
						icon: <Verify size="24" color="#FFF" style={{ minWidth: 24 }} />,
						type: 'text',
						description: 'Vérifiez votre adresse e-mail', // TODO translate
						title: translate('verified'),
						data: {
							text: user.emailVerified ? 'verified' : 'not verified',
							onPress: user.emailVerified
								? undefined
								: () =>
										API.fetch({ route: '/auth/reverify', method: 'PUT' })
											.then(() =>
												Toast.show({
													description: 'Verification mail sent',
												})
											)
											.catch((e) => {
												console.error(e);
												Toast.show({
													description: 'Verification mail send error',
												});
											}),
						},
					},
					{
						icon: <UserSquare size="24" color="#FFF" style={{ minWidth: 24 }} />,
						type: 'text',
						title: translate('avatar'),
						description: 'Changer votre photo de profile', // TODO translate
						data: {
							text: translate('changeIt'),
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
													description: 'Update successful',
												});
											})
											.catch((e) => {
												console.error(e);
												Toast.show({ description: 'Update failed' });
											});
									}
								});
							},
						},
					},
					{
						icon: <SmsEdit size="24" color="#FFF" style={{ minWidth: 24 }} />,
						type: 'sectionDropdown',
						title: 'Change email', // TODO translate
						description:
							'Saisissez votre adresse électronique actuelle et définissez votre nouvelle adresse électroniquetion', // TODO translate
						data: {
							value: true,
							section: [
								<ChangeEmailForm
									key={'ChangeEmailForm'}
									onSubmit={(oldEmail, newEmail) => handleChangeEmail(newEmail)}
								/>,
							],
						},
					},
					{
						icon: <PasswordCheck size="24" color="#FFF" style={{ minWidth: 24 }} />,
						type: 'sectionDropdown',
						title: 'Change password', // TODO translate
						description:
							'Saisissez votre mot de passe actuel et définissez votre nouveau mot de passe', // TODO translate
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
		</Flex>
	);
};

export default ProfileSettings;
