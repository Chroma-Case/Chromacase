import React from "react";
import { useDispatch } from '../state/Store';
import { translate } from "../i18n/i18n";
<<<<<<< HEAD
import { setUserToken } from "../state/UserSlice";
import { Center, Button, Text } from 'native-base';
=======
import { setUserToken, unsetUserToken } from "../state/UserSlice";

// create a view that can login and sign up

const AuthenticationView = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text style={{ textAlign: "center" }}>{ t('welcome') }</Text>
      <Button onPress={() => dispatch(setUserToken('token'))}>{ translate('signinBtn') }</Button>
      <Button onPress={() => dispatch(unsetUserToken())}>{ translate('signupBtn') }</Button>
      <Button onPress={() => dispatch(unsetUserToken())}>{ translate('signoutBtn') }</Button>
    </View>
  );
}

/*
>>>>>>> 46d6d0a (testing formik yup in react native)

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
}
*/


export default AuthenticationView;
