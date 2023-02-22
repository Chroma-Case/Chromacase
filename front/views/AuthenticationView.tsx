import React from "react";
import { useDispatch } from '../state/Store';
import { Translate, translate } from "../i18n/i18n";
import API, { APIError } from "../API";
import { setAccessToken } from "../state/UserSlice";
import { Center, Button, Text } from 'native-base';
import SigninForm from "../components/forms/signinform";
import SignupForm from "../components/forms/signupform";
import TextButton from "../components/TextButton";

const hanldeSignin = async (username: string, password: string, apiSetter: (accessToken: string) => void): Promise<string> => {
	try {
		const apiAccess = await API.authenticate({ username, password });
		apiSetter(apiAccess);
		return translate("loggedIn");
	} catch (error) {
		if (error instanceof APIError) return translate(error.userMessage);
		if (error instanceof Error) return error.message;
		return "Unknown error";
	}
};

const handleSignup = async (username: string, password: string, email: string, apiSetter: (accessToken: string) => void): Promise<string> => {
	try {
		const apiAccess = await API.createAccount({ username, password, email });
		apiSetter(apiAccess);
		return translate("loggedIn");
	} catch (error) {
		return "User already exists";
	}
};

const AuthenticationView = () => {
	const dispatch = useDispatch();
	const [mode, setMode] = React.useState("signin" as "signin" | "signup");

	return (
		<Center style={{ flex: 1 }}>
			<Text><Translate translationKey='welcome'/></Text>
			{mode === "signin" 
				? <SigninForm onSubmit={(username, password) => hanldeSignin(username, password, (accessToken) => dispatch(setAccessToken(accessToken)))} />
				: <SignupForm onSubmit={(username, password, email) => handleSignup(username, password, email, (accessToken) => dispatch(setAccessToken(accessToken)))} />
			}
			{ mode ==="signin" && <Button variant="outline" marginTop={5} colorScheme="error" >{translate("forgottenPassword")}</Button> }
			<TextButton
				translate={{ translationKey: mode === "signin" ? "signUp" : "signIn" }}
				variant='outline' marginTop={5} colorScheme='primary'
				onPress={() => setMode(mode === "signin" ? "signup" : "signin")}
			/>
		</Center>
	);
};

export default AuthenticationView;
