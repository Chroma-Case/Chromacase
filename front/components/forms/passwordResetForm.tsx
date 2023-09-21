import React from 'react';
import { translate } from '../../i18n/i18n';
import { string } from 'yup';
import { FormControl, Input, Stack, WarningOutlineIcon, Box, Button, useToast } from 'native-base';

interface PasswordResetFormProps {
	onSubmit: (newPassword: string) => Promise<string>;
}

const PasswordResetForm = ({ onSubmit }: PasswordResetFormProps) => {
	const [formData, setFormData] = React.useState({
		newPassword: {
			value: '',
			error: null as string | null,
		},
		confirmNewPassword: {
			value: '',
			error: null as string | null,
		},
	});
	const [submittingForm, setSubmittingForm] = React.useState(false);

	const validationSchemas = {
		password: string()
			.min(4, translate('passwordTooShort'))
			.max(100, translate('passwordTooLong'))
			.required('Password is required'),
	};
	const toast = useToast();

	return (
		<Box>
			<Stack mx="4" style={{ width: '80%', maxWidth: 400 }}>
				<FormControl
					isRequired
					isInvalid={
						formData.newPassword.error !== null ||
						formData.confirmNewPassword.error !== null
					}
				>
					<FormControl.Label>{translate('newPassword')}</FormControl.Label>
					<Input
						isRequired
						type="password"
						placeholder={translate('newPassword')}
						value={formData.newPassword.value}
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
					<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
						{formData.newPassword.error}
					</FormControl.ErrorMessage>

					<FormControl.Label>{translate('confirmNewPassword')}</FormControl.Label>
					<Input
						isRequired
						type="password"
						placeholder={translate('confirmNewPassword')}
						value={formData.confirmNewPassword.value}
						onChangeText={(t) => {
							let error: null | string = null;
							validationSchemas.password
								.validate(t)
								.catch((e) => (error = e.message));
							if (!error && t !== formData.newPassword.value) {
								error = translate('passwordsDontMatch');
							}
							setFormData({
								...formData,
								confirmNewPassword: { value: t, error },
							});
						}}
					/>
					<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
						{formData.confirmNewPassword.error}
					</FormControl.ErrorMessage>

					<Button
						style={{ marginTop: 10 }}
						isLoading={submittingForm}
						isDisabled={
							formData.newPassword.error !== null ||
							formData.confirmNewPassword.error !== null ||
							formData.newPassword.value === '' ||
							formData.confirmNewPassword.value === ''
						}
						onPress={async () => {
							setSubmittingForm(true);
							try {
								const resp = await onSubmit(formData.newPassword.value);
								toast.show({ description: resp });
							} catch (e) {
								toast.show({ description: e as string });
							} finally {
								setSubmittingForm(false);
							}
						}}
					>
						{translate('submitBtn')}
					</Button>
				</FormControl>
			</Stack>
		</Box>
	);
};

export default PasswordResetForm;
