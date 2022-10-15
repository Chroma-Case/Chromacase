// a form for login

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { setUserToken } from "../../state/UserSlice";
import { translate } from "../../i18n/i18n";
import { object, string, number, date, InferType } from "yup";
import {
	FormControl,
	Input,
	Stack,
	WarningOutlineIcon,
	Box,
	Button,
} from "native-base";

interface SigninFormProps {
	onSubmit: (username: string, password: string) => Promise<string>;
};

const LoginForm = ({ onSubmit }: SigninFormProps) => {
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
	const [formHelperText, setFormHelperText] = React.useState("");

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
						<FormControl.Label>{translate("username")}</FormControl.Label>
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
						<FormControl.ErrorMessage
							leftIcon={<WarningOutlineIcon size="xs" />}
						>
							{formData.username.error}
						</FormControl.ErrorMessage>
						<FormControl.Label>{translate("password")}</FormControl.Label>
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
						<FormControl.ErrorMessage
							leftIcon={<WarningOutlineIcon size="xs" />}
						>
							{formData.password.error}
						</FormControl.ErrorMessage>
						<FormControl.HelperText>
							{formHelperText}
						</FormControl.HelperText>
						<Button
							isLoading={submittingForm}
							isDisabled={
								formData.password.error !== null ||
								formData.username.error !== null ||
								formData.username.value === "" ||
								formData.password.value === ""
							}
							onPress={async () => {
								setSubmittingForm(true);
								try {
									const resp = await onSubmit(formData.username.value, formData.password.value);
									setFormHelperText(resp);
								} catch (e) {
									setFormHelperText(e as string);
								} finally {
									setSubmittingForm(false);
								}
							}}
						>
							{translate("login")}
						</Button>
					</FormControl>
				</Stack>
			</Box>
		</Box>
	);
};

export default LoginForm;
