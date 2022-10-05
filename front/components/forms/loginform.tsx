// a form for login

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { translate } from "../../i18n/i18n";
import { setUserToken, unsetUserToken } from "../../state/UserSlice";
import { object, string, number, date, InferType } from "yup";
import {
	FormControl,
	Input,
	Stack,
	WarningOutlineIcon,
	Box,
	Button,
	Center,
	NativeBaseProvider,
} from "native-base";

const LoginForm = () => {
	const [formData, setFormData] = React.useState({
		username: {
			value: "",
			error: null as string | null,
		},
		password: {
			value: "",
			error: null as string | null,
		},
	});
	const [submittingForm, setSubmittingForm] = React.useState(false);

	const validationSchemas = {
		username: string()
			.min(3, translate("usernameTooShort"))
			.max(20, translate("usernameTooLong"))
			.required("Username is required"),
		password: string()
			.min(4, translate("passwordTooShort"))
			.max(100, translate("passwordTooLong"))
			.required("Password is required"),
	};

	return (
		<Box alignItems="center">
			<Box w="100%" maxWidth="300px">
				<Stack mx="4">
					<FormControl
						isRequired
						isInvalid={formData.username.error !== null || formData.password.error !== null}
					>
						<FormControl.Label>Username</FormControl.Label>
						<Input
							isRequired
							type="text"
							placeholder="Katerina"
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
						/>
						<FormControl.HelperText></FormControl.HelperText>
						<FormControl.ErrorMessage
							leftIcon={<WarningOutlineIcon size="xs" />}
						>
							{formData.username.error}
						</FormControl.ErrorMessage>
						<FormControl.Label>Password</FormControl.Label>
						<Input
							isRequired
							type="password"
							placeholder="password"
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
						<FormControl.HelperText>
							Must be at least 4 characters.
						</FormControl.HelperText>
						<FormControl.ErrorMessage
							leftIcon={<WarningOutlineIcon size="xs" />}
						>
							{formData.password.error}
						</FormControl.ErrorMessage>
						<Button
							isLoading={submittingForm}
							isDisabled={
								formData.password.error !== null ||
								formData.username.error !== null ||
								formData.username.value === "" ||
								formData.password.value === ""
							}
							onPress={() => {
								setSubmittingForm(true);
								setTimeout(() => {
									setSubmittingForm(false);
									Alert.alert(
										"Form submitted",
										"Data: " + JSON.stringify(formData),
										[
											{
												text: "Cancel",
												onPress: () => console.log("Cancel Pressed"),
												style: "cancel",
											},
											{ text: "OK", onPress: () => console.log("OK Pressed") },
										]
									);
								}, 2000);
							}}
						>
							Login
						</Button>
					</FormControl>
				</Stack>
			</Box>
		</Box>
	);
};

export default LoginForm;
