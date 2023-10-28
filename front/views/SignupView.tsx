import React from 'react';
import { useDispatch } from '../state/Store';
import { translate } from '../i18n/i18n';
import API, { APIError } from '../API';
import { setAccessToken } from '../state/UserSlice';
import { string } from 'yup';
import { useToast } from 'native-base';
import TextFormField from '../components/UI/TextFormField';
import ButtonBase from '../components/UI/ButtonBase';
import { Lock1, Sms, User } from 'iconsax-react-native';
import ScaffoldAuth from '../components/UI/ScaffoldAuth';
import { useNavigation } from '../Navigation';

const handleSignup = async (
	username: string,
	password: string,
	email: string,
	apiSetter: (accessToken: string) => void
): Promise<string> => {
	try {
		const apiAccess = await API.createAccount({ username, password, email });
		apiSetter(apiAccess);
		return translate('loggedIn');
	} catch (error) {
		if (error instanceof APIError) return translate(error.userMessage);
		if (error instanceof Error) return error.message;
		return translate('unknownError');
	}
};

const SignupView = () => {
	const dispatch = useDispatch();
	const navigation = useNavigation();
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

	const onSubmit = (username: string, email: string, password: string) => {
		return handleSignup(username, password, email, (accessToken) =>
			dispatch(setAccessToken(accessToken))
		);
	};

	return (
		<ScaffoldAuth
			title={translate('signupPageTitle')}
			description={translate('signupPageParagraph')}
			form={[
				<TextFormField
					key={'signup-form-1'}
					error={formData.username.error}
					icon={User}
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
				/>,
				<TextFormField
					key={'signup-form-2'}
					error={formData.email.error}
					icon={Sms}
					placeholder="Email"
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
					isRequired
				/>,
				<TextFormField
					key={'signup-form-3'}
					isRequired
					isSecret
					error={formData.password.error}
					icon={Lock1}
					placeholder="Password"
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
				/>,
				<TextFormField
					key={'signup-form-4'}
					isRequired
					isSecret
					error={formData.repeatPassword.error}
					icon={Lock1}
					placeholder="Repeat password"
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
				/>,
			]}
			submitButton={
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
								formData.email.value,
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
			}
			link={{
				label: translate('signupLinkLabel'),
				text: translate('signupLinkText'),
				onPress: () => navigation.navigate('Login'),
			}}
		/>
	);
};

export default SignupView;
