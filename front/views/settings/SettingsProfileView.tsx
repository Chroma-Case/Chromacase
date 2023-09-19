import API from '../../API';
import { useDispatch } from 'react-redux';
import { unsetAccessToken } from '../../state/UserSlice';
import React from 'react';
import {
	Column,
	Text,
	Button,
	Box,
	Flex,
	Center,
	Heading,
	Popover,
	Toast,
	View,
} from 'native-base';
import TextButton from '../../components/TextButton';
import { LoadingView } from '../../components/Loading';
import ElementList from '../../components/GtkUI/ElementList';
import { translate } from '../../i18n/i18n';
import { useQuery } from '../../Queries';
import UserAvatar from '../../components/UserAvatar';
import * as ImagePicker from 'expo-image-picker';
import SettingBase from '../../components/UI/SettingsBase';
import {
	ArrowDown2,
	EyeSlash,
	Google,
	Lock1,
	PasswordCheck,
	Sms,
	SmsEdit,
	UserSquare,
} from 'iconsax-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TextFormField from '../../components/UI/TextFormField';
import ButtonBase from '../../components/UI/ButtonBase';
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
	const dispatch = useDispatch();

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
					width: '90%',
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
								<ChangePasswordForm
									onSubmit={(oldPassword, newPassword) =>
										handleChangePassword(oldPassword, newPassword)
									}
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
								<ChangeEmailForm
									onSubmit={(oldEmail, newEmail) => handleChangeEmail(newEmail)}
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
