// a form for sign up

import React from 'react';
import { translate } from '../../i18n/i18n';
import { string } from 'yup';
import { useToast, Column } from 'native-base';
import TextFormField from '../UI/TextFormField';
import { Lock1, Sms, User } from 'iconsax-react-native';
import ButtonBase from '../UI/ButtonBase';
import Spacer from '../UI/Spacer';

interface SignupFormProps {
	onSubmit: (username: string, password: string, email: string) => Promise<string>;
}

const SignUpForm = ({ onSubmit }: SignupFormProps) => {
	const [formData, setFormData] = React.useState({
		username: {
			value: '',
			error: null as string | null,
		},
		password: {
			value: '',
			error: null as string | null,
		},
		repeatPassword: {
			value: '',
			error: null as string | null,
		},
		email: {
			value: '',
			error: null as string | null,
		},
	});

	const validationSchemas = {
		username: string()
			.min(3, translate('usernameTooShort'))
			.max(20, translate('usernameTooLong'))
			.required('Username is required'),
		email: string().email('Invalid email').required('Email is required'),
		password: string()
			.min(4, translate('passwordTooShort'))
			.max(100, translate('passwordTooLong'))
			// .matches(
			// 	/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$-_%\^&\*])(?=.{8,})/,
			// 	translate(
			// 		"Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
			// 	)
			// )
			.required('Password is required'),
	};
	const toast = useToast();

	return (
		<Column space={4}>
			<TextFormField
				isRequired
				icon={User}
				error={formData.username.error}
				placeholder={translate('formPlaceholderUsername')}
				autoComplete="username-new"
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
			<TextFormField
				isRequired
				icon={Sms}
				error={formData.email.error}
				placeholder={translate('formPlaceholderEmail')}
				autoComplete="email"
				value={formData.email.value}
				onChangeText={(t) => {
					let error: null | string = null;
					validationSchemas.email
						.validate(t)
						.catch((e) => (error = e.message))
						.finally(() => {
							setFormData({ ...formData, email: { value: t, error } });
						});
				}}
			/>
			<TextFormField
				isRequired
				isSecret
				icon={Lock1}
				error={formData.password.error}
				placeholder={translate('formPlaceholderPassword')}
				autoComplete="password-new"
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
			<TextFormField
				isRequired
				isSecret
				error={formData.repeatPassword.error}
				icon={Lock1}
				placeholder={translate('formPlaceholderRepeatPassword')}
				autoComplete="password-new"
				value={formData.repeatPassword.value}
				onChangeText={(t) => {
					let error: null | string = null;
					validationSchemas.password
						.validate(t)
						.catch((e) => (error = e.message))
						.finally(() => {
							if (!error && t !== formData.password.value) {
								error = translate('passwordsDontMatch');
							}
							setFormData({
								...formData,
								repeatPassword: { value: t, error },
							});
						});
				}}
			/>
			<Spacer height="xs" />
			<ButtonBase
				style={{ width: '100%' }}
				title={translate('signUpBtn')}
				isDisabled={
					formData.username.error !== null ||
					formData.email.error !== null ||
					formData.password.error !== null ||
					formData.repeatPassword.error !== null ||
					formData.username.value === '' ||
					formData.email.value === '' ||
					formData.password.value === '' ||
					formData.repeatPassword.value === ''
				}
				onPress={async () => {
					try {
						const resp = await onSubmit(
							formData.username.value,
							formData.password.value,
							formData.email.value
						);
						toast.show({ description: resp });
					} catch (e) {
						toast.show({ description: e as string });
					}
				}}
			/>
		</Column>
	);
};

export default SignUpForm;
