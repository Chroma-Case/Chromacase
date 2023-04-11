import React from "react";
import SignUpForm from "../../components/forms/signupform";
import { Center } from "native-base";
import API, { APIError } from "../../API";
import { translate } from "../../i18n/i18n";
import { useDispatch } from "../../state/Store";
import { setAccessToken } from "../../state/UserSlice";

const handleSubmit = async (
	username: string,
	password: string,
	email: string,
	apiSetter: (token: string) => void
) => {
	let res: string;
	try {
		res = await API.createAccount({ username, password, email });
	} catch (error) {
		if (error instanceof APIError) return translate(error.userMessage);
		if (error instanceof Error) return error.message;
		return translate("unknownError");
	}
	apiSetter(res);
	return translate("loggedIn");
};

const GuestToUserView = () => {
	const dispatch = useDispatch();
	return (
		<Center flex={1} justifyContent={"center"}>
			<SignUpForm
				onSubmit={(username, password, email) =>
					handleSubmit(username, password, email, (token) =>
						dispatch(setAccessToken(token))
					)
				}
			/>
		</Center>
	);
};

export default GuestToUserView;
