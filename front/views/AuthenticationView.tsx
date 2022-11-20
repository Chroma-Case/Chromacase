import React from "react";
import { useDispatch } from '../state/Store';
import { Translate, translate } from "../i18n/i18n";
import API from "../API";
import { setUserToken } from "../state/UserSlice";
import { Center, Button, Text } from 'native-base';
import SigninForm from "../components/forms/signinform";
import SignupForm from "../components/forms/signupform";

const hanldeSignin = async (username: string, password: string, tokenSetter: (token: string) => void): Promise<string> => {
	try {
		const response = await API.checkSigninCredentials(username, password);
		tokenSetter(response);
		return translate("loggedIn");
	} catch (error) {
		return error as string;
	}
};

const handleSignup = async (username: string, password: string, email: string, tokenSetter: (t: string) => void): Promise<string> => {
	try {
		const response = await API.checkSignupCredentials(username, password, email);
		tokenSetter(response);
		return translate("loggedIn");
	} catch (error) {
		return error as string;
	}
};

const AuthenticationView = () => {
	const dispatch = useDispatch();
	const [mode, setMode] = React.useState("signin" as "signin" | "signup");

	return (
		<Center style={{ flex: 1 }}>
			<Text><Translate key='welcome'/></Text>
			{mode === "signin" ? (<>
				<Text fontWeight='thin'>username, password:</Text>
				<Text fontWeight='thin'>katerina, 1234</Text>
				<SigninForm onSubmit={(username, password) => hanldeSignin(username, password, (token) => dispatch(setUserToken(token)))} />
			</>) : (
				<SignupForm onSubmit={(username, password, email) => handleSignup(username, password, email, (token) => dispatch(setUserToken(token)))} />
			)}
			{ mode ==="signin" && <Button variant="outline" marginTop={5} colorScheme="error" ><Translate key='forgottenPassword'/></Button> }
			<Button variant='outline' marginTop={5} colorScheme='primary' onPress={() => setMode(mode === "signin" ? "signup" : "signin")}>
				<Text>
					<Translate key={mode === "signin" ? "signUp" : "signIn"}/>
				</Text>
			</Button>
		</Center>
	);
};

export default AuthenticationView;
