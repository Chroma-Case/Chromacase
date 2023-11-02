import ButtonBase, { ButtonType } from './ButtonBase';
import { LogoutCurve } from 'iconsax-react-native';
import { useDispatch } from 'react-redux';
import { translate } from '../../i18n/i18n';
import { unsetAccessToken } from '../../state/UserSlice';
import { useState } from 'react';
import React from 'react';
import SignUpForm from '../../components/forms/signupform';
import API, { APIError } from '../../API';
import PopupCC from './PopupCC';
import { StyleProp, ViewStyle } from 'react-native';

const handleSubmit = async (username: string, password: string, email: string) => {
	try {
		await API.transformGuestToUser({ username, password, email });
	} catch (error) {
		if (error instanceof APIError) return translate(error.userMessage);
		if (error instanceof Error) return error.message;
		return translate('unknownError');
	}
	return translate('loggedIn');
};

type LogoutButtonCCProps = {
	collapse?: boolean;
	isGuest?: boolean;
	style: StyleProp<ViewStyle>;
	buttonType: ButtonType;
};

const LogoutButtonCC = ({
	collapse = false,
	isGuest = false,
	buttonType = 'menu',
	style,
}: LogoutButtonCCProps) => {
	const dispatch = useDispatch();
	const [isVisible, setIsVisible] = useState(false);

	return (
        <>
            <ButtonBase
                style={style}
                icon={LogoutCurve}
                title={!collapse ? translate('signOutBtn') : undefined}
                type={buttonType}
                onPress={async () => {isGuest ? setIsVisible(true) : dispatch(unsetAccessToken());}}
            />
            <PopupCC
                title={translate('Attention')}
                description={translate('transformGuestToUserExplanations')}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
            >
                <SignUpForm onSubmit={handleSubmit} />
                <ButtonBase
                    style={!collapse ? { width: '100%' } : {}}
                    type="outlined"
                    icon={LogoutCurve}
                    title={translate('signOutBtn')}
                    onPress={async () => { dispatch(unsetAccessToken()) }}
                />  
            </PopupCC>
        </>
	);
};

export default LogoutButtonCC;
