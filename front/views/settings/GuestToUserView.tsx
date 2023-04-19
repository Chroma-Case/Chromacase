import React from "react";
import SignUpForm from "../../components/forms/signupform";
import { Center, Heading, Text } from "native-base";
import API, { APIError } from "../../API";
import { translate } from "../../i18n/i18n";

const handleSubmit = async (
	username: string,
	password: string,
	email: string
) => {
	try {
		await API.transformGuestToUser({ username, password, email });
	} catch (error) {
		if (error instanceof APIError) return translate(error.userMessage);
		if (error instanceof Error) return error.message;
		return translate("unknownError");
	}
	return translate("loggedIn");
};

const GuestToUserView = () => {
	return (
		<Center flex={1} justifyContent={"center"}>
			<Center width="90%" justifyContent={"center"}>
				<Heading>{translate("signUp")}</Heading>
				<Text mt={5} mb={10}>
					{translate("transformGuestToUserExplanations")}
				</Text>
				<SignUpForm
					onSubmit={(username, password, email) =>
						handleSubmit(username, password, email)
					}
				/>
			</Center>
		</Center>
	);
};

export default GuestToUserView;
