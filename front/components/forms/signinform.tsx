// a form for sign in

import React from 'react';
import { Translate, translate } from '../../i18n/i18n';
import { string } from 'yup';
import { FormControl, Input, Stack, WarningOutlineIcon, Box, useToast } from 'native-base';
import TextButton from '../TextButton';

interface SigninFormProps {
	onSubmit: (username: string, password: string) => Promise<string>;
}

const LoginForm = ({ onSubmit }: SigninFormProps) => {
	const [formData, setFormData] = React.useState({
		username: {
			value: '',
			error: null as string | null,
		},
		password: {
			value: '',
			error: null as string | null,
		},
	});
	const [submittingForm, setSubmittingForm] = React.useState(false);

	const validationSchemas = {
		username: string()
			.min(3, translate('usernameTooShort'))
			.max(20, translate('usernameTooLong'))
			.required('Username is required'),
		password: string()
			.min(4, translate('passwordTooShort'))
			.max(100, translate('passwordTooLong'))
			.required('Password is required'),
	};
	const toast = useToast();
	return (
		<Box alignItems="center" style={{ width: '100%' }}>
			<Stack mx="4" style={{ width: '80%', maxWidth: 400 }}>
				<FormControl
					isRequired
					isInvalid={formData.username.error !== null || formData.password.error !== null}
				>
					<FormControl.Label>
						<Translate translationKey="username" />
					</FormControl.Label>
					<Input
						isRequired
						type="text"
						placeholder="Username"
						autoComplete="username"
						value={formData.username.value}
						onChangeText={(t) => {
							let error: null | string = null;
							validationSchemas.username
								.validate(t)
								.catch((e) => (error = e.message))
								.finally(() => {
									setFormData({ ...formData, username: { value: t, error } });
								});
						}}
					/>
					<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
						{formData.username.error}
					</FormControl.ErrorMessage>
					<FormControl.Label>
						<Translate translationKey="password" />
					</FormControl.Label>
					<Input
						isRequired
						type="password"
						autoComplete="password"
						value={formData.password.value}
						onChangeText={(t) => {
							let error: null | string = null;
							validationSchemas.password
								.validate(t)
								.catch((e) => (error = e.message))
								.finally(() => {
									setFormData({ ...formData, password: { value: t, error } });
								});
						}}
					/>
					<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
						{formData.password.error}
					</FormControl.ErrorMessage>
					<TextButton
						translate={{ translationKey: 'signInBtn' }}
						style={{ marginTop: 10 }}
						isLoading={submittingForm}
						isDisabled={
							formData.password.error !== null ||
							formData.username.error !== null ||
							formData.username.value === '' ||
							formData.password.value === ''
						}
						onPress={async () => {
							setSubmittingForm(true);
							try {
								const resp = await onSubmit(
									formData.username.value,
									formData.password.value
								);
								toast.show({ description: resp, colorScheme: 'secondary' });
								setSubmittingForm(false);
							} catch (e) {
								toast.show({
									description: e as string,
									colorScheme: 'red',
									avoidKeyboard: true,
								});
								setSubmittingForm(false);
							}
						}}
					/>
				</FormControl>
			</Stack>
		</Box>
	);
};

export default LoginForm;
