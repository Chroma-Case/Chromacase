import React from 'react';
import { useDispatch } from '../state/Store';
import { translate } from '../i18n/i18n';
import API, { APIError } from '../API';
import { setAccessToken } from '../state/UserSlice';
import { string } from 'yup';
import { useToast } from 'native-base';
import TextFormField from '../components/UI/TextFormField';
import ButtonBase from '../components/UI/ButtonBase';
import { Lock1, User } from 'iconsax-react-native';
import ScaffoldAuth from '../components/UI/ScaffoldAuth';
import { useNavigation } from '../Navigation';
import LinkBase from '../components/UI/LinkBase';

const hanldeSignin = async (
	username: string,
	password: string,
	apiSetter: (accessToken: string) => void
): Promise<string> => {
	try {
		const apiAccess = await API.authenticate({ username, password });
		apiSetter(apiAccess);
		return translate('loggedIn');
	} catch (error) {
		if (error instanceof APIError) return translate(error.userMessage);
		if (error instanceof Error) return error.message;
		return translate('unknownError');
	}
};

const SigninView = () => {
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

	const onSubmit = (username: string, password: string) => {
		return hanldeSignin(username, password, (accessToken) =>
			dispatch(setAccessToken(accessToken))
		);
	};

	return (
		<ScaffoldAuth
			title="Bienvenue !"
			description="Continuez avec Google ou entrez vos coordonnées."
			form={[
				<TextFormField
					key={'signin-form-1'}
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
					key={'signin-form-2'}
					error={formData.password.error}
					icon={Lock1}
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
					isRequired
				/>,
				<LinkBase key={'signin-link'} onPress={() => navigation.navigate('ForgotPassword')}>
					{translate('forgottenPassword')}
				</LinkBase>,
			]}
			submitButton={
				<ButtonBase
					style={{ width: '100%' }}
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
			}
			link={{
				text: 'Inscrivez-vous gratuitement',
				description: "Vous n'avez pas de compte ? ",
				onPress: () => navigation.navigate('Signup'),
			}}
		/>
	);
};

export default SigninView;
