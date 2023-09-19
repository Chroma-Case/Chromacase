import React from 'react';
import { translate } from '../../i18n/i18n';
import { string } from 'yup';
import {
	FormControl,
	Input,
	Stack,
	WarningOutlineIcon,
	Box,
	Button,
	useToast,
	Flex,
} from 'native-base';
import TextFormField from '../UI/TextFormField';
import { Lock1 } from 'iconsax-react-native';
import ButtonBase from '../UI/ButtonBase';

interface ChangePasswordFormProps {
	onSubmit: (oldPassword: string, newPassword: string) => Promise<string>;
}

const ChangePasswordForm = ({ onSubmit }: ChangePasswordFormProps) => {
	const [formData, setFormData] = React.useState({
		oldPassword: {
			value: '',
			error: null as string | null,
		},
		newPassword: {
			value: '',
			error: null as string | null,
		},
		confirmNewPassword: {
			value: '',
			error: null as string | null,
		},
	});

	const validationSchemas = {
		password: string()
			.min(4, translate('passwordTooShort'))
			.max(100, translate('passwordTooLong'))
			.required('Password is required'),
	};
	const toast = useToast();

	return (
		<Flex style={{ width: '100%', maxWidth: 420 }}>
			<TextFormField
				style={{ marginVertical: 10 }}
				isSecret
				isRequired
				autoComplete="password"
				icon={(size, color) => <Lock1 size={size} color={color} variant="Bold" />}
				placeholder={translate('oldPassword')}
				value={formData.oldPassword.value}
				error={formData.oldPassword.error}
				onChangeText={(t) => {
					let error: null | string = null;
					validationSchemas.password
						.validate(t)
						.catch((e) => (error = e.message))
						.finally(() => {
							setFormData({ ...formData, oldPassword: { value: t, error } });
						});
				}}
			/>
			<TextFormField
				style={{ marginVertical: 10 }}
				isSecret
				isRequired
				autoComplete="password"
				icon={(size, color) => <Lock1 size={size} color={color} variant="Bold" />}
				placeholder={translate('newPassword')}
				value={formData.newPassword.value}
				error={formData.newPassword.error}
				onChangeText={(t) => {
					let error: null | string = null;
					validationSchemas.password
						.validate(t)
						.catch((e) => (error = e.message))
						.finally(() => {
							setFormData({ ...formData, newPassword: { value: t, error } });
						});
				}}
			/>
			<TextFormField
				style={{ marginVertical: 10 }}
				isSecret
				isRequired
				autoComplete="password"
				icon={(size, color) => <Lock1 size={size} color={color} variant="Bold" />}
				placeholder={translate('confirmNewPassword')}
				value={formData.confirmNewPassword.value}
				error={formData.confirmNewPassword.error}
				onChangeText={(t) => {
					let error: null | string = null;
					validationSchemas.password.validate(t).catch((e) => (error = e.message));
					if (!error && t !== formData.newPassword.value) {
						error = translate('passwordsDontMatch');
					}
					setFormData({
						...formData,
						confirmNewPassword: { value: t, error },
					});
				}}
			/>
			<ButtonBase
				isDisabled={
					formData.oldPassword.error !== null ||
					formData.newPassword.error !== null ||
					formData.confirmNewPassword.error !== null ||
					formData.oldPassword.value === '' ||
					formData.newPassword.value === '' ||
					formData.confirmNewPassword.value === ''
				}
				type={'filled'}
				title={translate('submitBtn')}
				style={{ marginVertical: 10 }}
				onPress={async () => {
					try {
						const resp = await onSubmit(
							formData.oldPassword.value,
							formData.newPassword.value
						);
						toast.show({ description: resp });
					} catch (e) {
						toast.show({ description: e as string });
					}
				}}
			/>
		</Flex>
	);
};

export default ChangePasswordForm;
