import React from "react";
import { useDispatch } from '../state/Store';
import { translate } from "../i18n/i18n";
import { setUserToken } from "../state/UserSlice";
import { Center, Button, Text } from 'native-base';
import SigninForm from "../components/forms/signinform";
import SignupForm from "../components/forms/signupform";

const checkLoginCredentials = async (username: string, password: string, tokenSetter: (token: string) => void) => {
	return new Promise<string>((resolve, reject) => {
		setTimeout(() => {
			if (username === "katerina" && password === "1234") {
				// got a red warning if i don't wait a little bit before setting the token 
				setTimeout(() => tokenSetter("1234"), 500);
				return resolve("st germain c'est stylé, big up à Arthur");
			}
			return reject(translate("invalidCredentials"));
		}, 1000);
	});
};

const checkSignupCredentials = async (username: string, password: string, email: string, tokenSetter: (t: string) => void) => {
	return new Promise<string>((resolve, reject) => {
		setTimeout(() => {
			if (username === "bluub") {
				return reject("bluub is a cool username but déjà prit");
			}
			setTimeout(() => tokenSetter("4321"), 100);
			return resolve(translate("accountCreated"));
		}, 1000);
	});
};

const AuthenticationView = () => {
	const dispatch = useDispatch();
	const [mode, setMode] = React.useState("signin" as "signin" | "signup");

	return (
		<Center style={{ flex: 1 }}>
			<Text>{translate('welcome')}</Text>
			{mode === "signin" ? (<>
				<Text fontWeight='thin'>username, password:</Text>
				<Text fontWeight='thin'>katerina, 1234</Text>
				<SigninForm onSubmit={(username, password) => checkLoginCredentials(username, password, (token) => dispatch(setUserToken(token)))} />
			</>) : (
				<SignupForm onSubmit={(username, password, email) => checkSignupCredentials(username, password, email, (token) => dispatch(setUserToken(token)))} />
			)}
			{ mode ==="signin" && <Button variant="outline" marginTop={5} colorScheme="error" >{translate("forgottenPassword")}</Button> }
			<Button variant='outline' marginTop={5} colorScheme='primary' onPress={() => setMode(mode === "signin" ? "signup" : "signin")}>
				<Text>{translate(mode === "signin" ? "signUp" : "signIn")}</Text>
			</Button>
		</Center>
	);
};

export default AuthenticationView;
