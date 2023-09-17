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
import { TouchableOpacity, Linking, View, StyleSheet  } from 'react-native'
import TextFormField from '../components/UI/TextFormField';
import LinkBase from '../components/UI/LinkBase';
import SeparatorBase from '../components/UI/SeparatorBase';
import ButtonBase from '../components/UI/ButtonBase';
import { Image, Flex } from 'native-base';
import ImageBanner from '../assets/banner.jpg';
import TMPBase from '../components/UI/TMPBase';
import { LinearGradient } from 'expo-linear-gradient';

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


    const onSubmit= (username: string, password: string) => {
        return hanldeSignin(username, password, (accessToken) =>
            dispatch(setAccessToken(accessToken))
        );
    }

	return (
        <Flex direction='row' justifyContent="space-between" style={{ flex: 1, backgroundColor: '#101014'}}>
            <Center style={{ flex: 1}}>
                <Stack space={4} justifyContent="center" alignContent="center" alignItems="center" style={{ width: '100%', maxWidth: 420, padding: 16 }}>
                    <Text fontSize="4xl" textAlign="center">
                        Bienvenue !
                    </Text>
                    <Text fontSize="xl" textAlign="center">
                        Continuez avec Google ou entrez vos coordonnées.
                    </Text>
                    <ButtonBase
                        type='outlined'
                        iconImage='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png'
                        title="Signin with google"
                    />
                    <ButtonBase
                        type='menu'
                        icon='person'
                        title="Menu"
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
                    <LinkBase onPress={() => console.log('Link clicked!')}>
                    {translate('forgottenPassword')}
                    </LinkBase>

                    <ButtonBase
                        type='outlined'
                        icon='alert'
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
                    <Text>Vous n'avez pas de compte ?</Text>
                    <LinkBase onPress={() => navigation.navigate('Signup', {})}>
                        Inscrivez-vous gratuitement
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
            <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                colors={['#101014', '#6075F9']}
                style={{top: 0, bottom: 0, right: 0, left: 0, width: '100%', height: '100%', position: 'absolute', zIndex: -2}}
            />
        </Flex>
	);
};

export default SigninView;