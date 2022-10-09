import React from "react";
import { useDispatch } from '../state/Store';
import { translate } from "../i18n/i18n";
import { setUserToken } from "../state/UserSlice";
import { Center, Button, Text } from 'native-base';
import LoginForm from "../components/forms/loginform";

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

const AuthenticationView = () => {
	const dispatch = useDispatch();

	return (
		<Center style={{ flex: 1 }}>
			<Text>{translate('welcome')}</Text>
      <LoginForm onSubmit={(u, p) => checkLoginCredentials(u, p, (t) => dispatch(setUserToken(t)))} />
		</Center>
	);
};

export default AuthenticationView;
