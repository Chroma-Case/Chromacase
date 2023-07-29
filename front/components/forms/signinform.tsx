// a form for sign in

import React from 'react';
import { Translate, translate } from '../../i18n/i18n';
import { string } from 'yup';
import { FormControl, Input, Stack, WarningOutlineIcon, Box, useToast } from 'native-base';
import TextButton from '../TextButton';
import TextFormField from '../UI/TextFormField';
import ButtonBase from '../UI/ButtonBase';

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
		<Box alignItems="center" style={{ width: '100%', backgroundColor: "#101014" }}>
			<Stack mx="4" style={{ width: '80%', maxWidth: 400 }}>
				<FormControl
					isRequired
					isInvalid={formData.username.error !== null || formData.password.error !== null}
				>
					<TextFormField
						error={formData.username.error}
						icon='person'
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
						isRequired
					/>
					<TextFormField
						isRequired
						isSecret
						error={formData.password.error}
						icon='lock-closed'
						placeholder="Password"
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
					<ButtonBase
						title="Signin"
						isDisabled={
							formData.password.error !== null ||
							formData.username.error !== null ||
							formData.username.value === '' ||
							formData.password.value === ''
						}
						onPress={async () => {
							try {
								const resp = await onSubmit(
									formData.username.value,
									formData.password.value
								);
								toast.show({ description: resp, colorScheme: 'secondary' });
							} catch (e) {
								toast.show({
									description: e as string,
									colorScheme: 'red',
									avoidKeyboard: true,
								});
							}
						}}
					/>
					<ButtonBase
						// icon='logo-google'
						isOutlined
						iconImage='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png'
						title="Signin with google"
					/>
				</FormControl>
			</Stack>
		</Box>
	);
};

export default LoginForm;
