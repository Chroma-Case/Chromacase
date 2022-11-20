// a form for sign up

import React from "react";
import { Translate, translate } from "../../i18n/i18n";
import { string } from "yup";
import {
	FormControl,
	Input,
	Stack,
	WarningOutlineIcon,
	Box,
	Button,
	useToast,
} from "native-base";

interface SignupFormProps {
	onSubmit: (
		username: string,
		password: string,
		email: string
	) => Promise<string>;
}

const LoginForm = ({ onSubmit }: SignupFormProps) => {
	const [formData, setFormData] = React.useState({
		username: {
			value: "",
			error: null as string | null,
		},
		password: {
			value: "",
			error: null as string | null,
		},
		repeatPassword: {
			value: "",
			error: null as string | null,
		},
		email: {
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
		email: string().email("Invalid email").required("Email is required"),
		password: string()
			.min(4, translate("passwordTooShort"))
			.max(100, translate("passwordTooLong"))
			.matches(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
				translate(
					"Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
				)
			)
			.required("Password is required"),
	};
	const toast = useToast();

	return (
		<Box alignItems="center" style={{ width: '100%' }}>
			<Box style={{ width: '80%', maxWidth: 400 }}>
				<Stack mx="4">
					<FormControl
						isRequired
						isInvalid={
							formData.username.error !== null ||
							formData.password.error !== null ||
							formData.repeatPassword.error !== null ||
							formData.email.error !== null
						}
					>
						<FormControl.Label>
							<Translate key='username'/>
						</FormControl.Label>
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
						<FormControl.Label>
							<Translate key='email'/>
						</FormControl.Label>
						<Input
							isRequired
							type="text"
							placeholder="lucy@er.com"
							value={formData.email.value}
							onChangeText={(t) => {
								let error: null | string = null;
								validationSchemas.email
									.validate(t)
									.catch((e) => (error = e.message))
									.finally(() => {
										setFormData({ ...formData, email: { value: t, error } });
									});
							}}
						/>
						<FormControl.ErrorMessage
							leftIcon={<WarningOutlineIcon size="xs" />}
						>
							{formData.email.error}
						</FormControl.ErrorMessage>
						<FormControl.Label>
							<Translate key='password'/>
						</FormControl.Label>
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
						<FormControl.Label>
							<Translate key='repeatPassword'/>
						</FormControl.Label>
						<Input
							isRequired
							type="password"
							placeholder="password"
							value={formData.repeatPassword.value}
							onChangeText={(t) => {
								let error: null | string = null;
								validationSchemas.password
									.validate(t)
									.catch((e) => (error = e.message))
									.finally(() => {
										if (!error && t !== formData.password.value) {
											error = translate("passwordsDontMatch");
										}
										setFormData({
											...formData,
											repeatPassword: { value: t, error },
										});
									});
							}}
						/>
						<FormControl.ErrorMessage
							leftIcon={<WarningOutlineIcon size="xs" />}
						>
							{formData.repeatPassword.error}
						</FormControl.ErrorMessage>
						<Button
							style={{ marginTop: 10 }}
							isLoading={submittingForm}
							isDisabled={
								formData.password.error !== null ||
								formData.username.error !== null ||
								formData.repeatPassword.error !== null ||
								formData.email.error !== null ||
								formData.username.value === "" ||
								formData.password.value === "" ||
								formData.repeatPassword.value === "" ||
								formData.repeatPassword.value === ""
							}
							onPress={async () => {
								setSubmittingForm(true);
								try {
									const resp = await onSubmit(
										formData.username.value,
										formData.password.value,
										formData.email.value
									);
									toast.show({ description: resp });
								} catch (e) {
									toast.show({ description: e as string });
								} finally {
									setSubmittingForm(false);
								}
							}}
						>
							<Translate key='signUp'/>
						</Button>
					</FormControl>
				</Stack>
			</Box>
		</Box>
	);
};

export default LoginForm;
