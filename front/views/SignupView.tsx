import React from 'react';
import { useDispatch } from '../state/Store';
import { Translate, translate } from '../i18n/i18n';
import API, { APIError } from '../API';
import { setAccessToken } from '../state/UserSlice';
import {  } from 'native-base';
import SigninForm from '../components/forms/signinform';
import TextButton from '../components/TextButton';
import { useNavigation } from '../Navigation';
import { string } from 'yup';
import { FormControl, Input, Stack, Center, Button, Text, Box, useToast } from 'native-base';
import { TouchableOpacity, Linking, View } from 'react-native'
import TextFormField from '../components/UI/TextFormField';
import LinkBase from '../components/UI/LinkBase';
import SeparatorBase from '../components/UI/SeparatorBase';
import ButtonBase from '../components/UI/ButtonBase';
import { Image, Flex } from 'native-base';
import ImageBanner from '../assets/banner.jpg';

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


    const onSubmit= (username: string, email: string, password: string) => {
        return handleSignup(username, password, email, (accessToken) =>
            dispatch(setAccessToken(accessToken))
        )
    }

	return (
        <Flex direction='row' justifyContent="space-between" style={{ flex: 1, backgroundColor: '#101014'}}>
            <Center style={{ flex: 1}}>
            <Stack space={4} justifyContent="center" alignContent="center" alignItems="center" mx="4" style={{ width: '100%', maxWidth: 420, padding: 16 }}>
                <Text fontSize="4xl" textAlign="center">Créer un compte</Text>
                <Text fontSize="xl" textAlign="center">Apprendre le piano gratuitement et de manière ludique</Text>
                <ButtonBase
                    isOutlined
                    iconImage='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png'
                    title="Signup with google"
                />
                <SeparatorBase>or</SeparatorBase>
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
                    error={formData.email.error}
                    icon='mail'
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
                />
                <TextFormField
                    isRequired
                    isSecret
                    error={formData.password.error}
                    icon='lock-closed'
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
                />
                <TextFormField
                    isRequired
                    isSecret
                    error={formData.repeatPassword.error}
                    icon='lock-closed'
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
                />
                <ButtonBase
                    title="Signup"
                    isDisabled={
                        formData.password.error !== null ||
                        formData.username.error !== null ||
                        formData.repeatPassword.error !== null ||
                        formData.email.error !== null ||
                        formData.username.value === '' ||
                        formData.password.value === '' ||
                        formData.repeatPassword.value === '' ||
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
                <Text>Vous avez déjà un compte ?</Text>
                <LinkBase onPress={() => navigation.navigate('Login', {})}>
                    S'identifier
                </LinkBase>
            </Stack>
            </Center>
            <View style={{width: '50%', height: '100%', padding: 16}}>
                <Image
                    source={ImageBanner}
                    alt="banner page"
                    style={{width: '100%', height: '100%', borderRadius: 8}}
                />
            </View>
        </Flex>
	);
};

export default SigninView;
