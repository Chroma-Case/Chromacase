import React from "react";
import { useDispatch } from '../state/Store';
import { translate } from "../i18n/i18n";
import { setUserToken } from "../state/UserSlice";
import { Center, Button, Text } from 'native-base';

const AuthenticationView = () => {
	const dispatch = useDispatch();
	return (
		<Center style={{ flex: 1 }}>
			<Text>{translate('welcome')}</Text>
			<Button variant='ghost' onPress={() => dispatch(setUserToken('kkkk'))}>
				{translate('signinBtn')}
			</Button>
		</Center>
	);
};

export default AuthenticationView;
